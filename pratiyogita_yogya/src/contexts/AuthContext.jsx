/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GithubAuthProvider,
  GoogleAuthProvider,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { applyAuthPersistence, auth, db } from '../config/firebase';

const AuthContext = createContext(null);

const AUTH_SYNC_COLLECTION = 'authSync';
const AUTH_SYNC_DOC = 'state';
const APP_SOURCE = 'eligibility-site';

function getAuthSyncRef(uid) {
  return doc(db, 'users', uid, AUTH_SYNC_COLLECTION, AUTH_SYNC_DOC);
}

async function updateAuthSyncState(uid, loggedIn) {
  if (!uid) return;

  try {
    await setDoc(
      getAuthSyncRef(uid),
      {
        loggedIn,
        source: APP_SOURCE,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Auth sync state update failed:', error);
  }
}

async function upsertUserDocument(user, displayName = null) {
  if (!user?.uid) return;

  const userRef = doc(db, 'users', user.uid);
  const existing = await getDoc(userRef);

  if (!existing.exists()) {
    await setDoc(
      userRef,
      {
        email: user.email || null,
        displayName: displayName || user.displayName || null,
        createdAt: serverTimestamp(),
        provider: user.providerData?.[0]?.providerId || 'password',
      },
      { merge: true }
    );
    return;
  }

  await setDoc(
    userRef,
    {
      email: user.email || existing.data()?.email || null,
      displayName: displayName || user.displayName || existing.data()?.displayName || null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, displayName, rememberMe = true) => {
    await applyAuthPersistence(rememberMe);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (displayName?.trim()) {
      await updateProfile(user, { displayName: displayName.trim() });
    }

    await upsertUserDocument(user, displayName?.trim());
    await updateAuthSyncState(user.uid, true);

    return userCredential;
  };

  const login = async (email, password, rememberMe = true) => {
    await applyAuthPersistence(rememberMe);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await upsertUserDocument(userCredential.user);
    await updateAuthSyncState(userCredential.user.uid, true);
    return userCredential;
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (popupError) {
        if (
          popupError.code === 'auth/popup-blocked' ||
          popupError.code === 'auth/cancelled-popup-request' ||
          popupError?.message?.includes('popup')
        ) {
          await signInWithRedirect(auth, provider);
          return null;
        }
        throw popupError;
      }

      await upsertUserDocument(result.user);
      await updateAuthSyncState(result.user.uid, true);
      return result;
    } catch (error) {
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by your browser. Please allow popups and try again.');
      }
      if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Login was cancelled. Please try again.');
      }
      if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      throw error;
    }
  };

  const loginWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      provider.setCustomParameters({
        allow_signup: 'true',
      });

      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (popupError) {
        if (
          popupError.code === 'auth/popup-blocked' ||
          popupError.code === 'auth/cancelled-popup-request' ||
          popupError?.message?.includes('popup')
        ) {
          await signInWithRedirect(auth, provider);
          return null;
        }
        throw popupError;
      }

      await upsertUserDocument(result.user);
      await updateAuthSyncState(result.user.uid, true);
      return result;
    } catch (error) {
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by your browser. Please allow popups and try again.');
      }
      if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Login was cancelled. Please try again.');
      }
      if (error.code === 'auth/account-exists-with-different-credential') {
        throw new Error('An account already exists with this email using another login method.');
      }
      if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      throw error;
    }
  };

  const logout = async () => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      await updateAuthSyncState(uid, false);
    }
    await signOut(auth);
  };

  useEffect(() => {
    let unsubscribeSync = null;

    const unsubscribeAuth = onIdTokenChanged(auth, async (user) => {
      if (unsubscribeSync) {
        unsubscribeSync();
        unsubscribeSync = null;
      }

      if (!user) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        await user.getIdToken();
      } catch (error) {
        console.warn('Session token invalid or expired. Logging out.', error);
        await signOut(auth);
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      setCurrentUser(user);
      setLoading(false);

      const userSignInAt = user.metadata?.lastSignInTime
        ? new Date(user.metadata.lastSignInTime).getTime()
        : Date.now();

      unsubscribeSync = onSnapshot(getAuthSyncRef(user.uid), async (snapshot) => {
        const data = snapshot.data();
        if (!data) return;

        const updatedAtMs = data?.updatedAt?.toMillis?.() || 0;
        const isRemoteLogout = data.loggedIn === false && updatedAtMs >= userSignInAt - 5000;

        if (isRemoteLogout && auth.currentUser) {
          await signOut(auth);
        }
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSync) unsubscribeSync();
    };
  }, []);

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result?.user) return;

        await upsertUserDocument(result.user);
        await updateAuthSyncState(result.user.uid, true);
      } catch (error) {
        console.error('Error handling auth redirect result:', error);
      }
    };

    handleRedirectResult();
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      signup,
      login,
      loginWithGoogle,
      loginWithGithub,
      logout,
    }),
    [currentUser, loading]
  );

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
