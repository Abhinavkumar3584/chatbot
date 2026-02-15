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
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

const AUTH_SYNC_COLLECTION = 'authSync';
const AUTH_SYNC_DOC = 'state';
const AUTH_SYNC_SOURCE = 'pratiyogita-marg';

type AuthContextValue = {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  loginWithGithub: () => Promise<any>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getAuthSyncRef(uid: string) {
  return doc(db, 'users', uid, AUTH_SYNC_COLLECTION, AUTH_SYNC_DOC);
}

async function updateAuthSyncState(uid: string, loggedIn: boolean) {
  if (!uid) return;

  try {
    await setDoc(
      getAuthSyncRef(uid),
      {
        loggedIn,
        source: AUTH_SYNC_SOURCE,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Auth sync state update failed:', error);
  }
}

async function upsertUserDocument(user: User, displayName: string | null = null) {
  if (!user?.uid) return;

  const trimmedDisplayName = displayName?.trim() || null;
  const userRef = doc(db, 'users', user.uid);
  const existing = await getDoc(userRef);
  const existingData = existing.data() || {};

  if (!trimmedDisplayName && !user.displayName && existingData?.displayName) {
    try {
      await updateProfile(user, { displayName: String(existingData.displayName) });
    } catch (error) {
      console.warn('Failed to sync display name from Firestore to auth profile:', error);
    }
  }

  const resolvedDisplayName =
    trimmedDisplayName || user.displayName || existingData?.displayName || null;

  if (!existing.exists()) {
    await setDoc(
      userRef,
      {
        email: user.email || null,
        displayName: resolvedDisplayName,
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
      email: user.email || existingData?.email || null,
      displayName: resolvedDisplayName,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (displayName?.trim()) {
      await updateProfile(user, { displayName: displayName.trim() });
    }

    await upsertUserDocument(user, displayName?.trim());
    await updateAuthSyncState(user.uid, true);

    return userCredential;
  }

  async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await upsertUserDocument(userCredential.user);
    await updateAuthSyncState(userCredential.user.uid, true);
    return userCredential;
  }

  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (popupError: any) {
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
    } catch (error: any) {
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
  }

  async function loginWithGithub() {
    try {
      const provider = new GithubAuthProvider();
      provider.setCustomParameters({ allow_signup: 'true' });

      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (popupError: any) {
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
    } catch (error: any) {
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
  }

  async function logout() {
    const uid = auth.currentUser?.uid;
    if (uid) {
      await updateAuthSyncState(uid, false);
    }
    await signOut(auth);
  }

  useEffect(() => {
    let unsubscribeSync: null | (() => void) = null;

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
