import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
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
    console.warn('⚠️ Could not update auth sync state:', error);
  }
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

  async function ensureUserDocument(user: User, provider: string) {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || 'User',
        photoURL: user.photoURL || null,
        provider,
        createdAt: serverTimestamp(),
      });
    }
  }

  async function signup(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName });
    await ensureUserDocument(user, 'password');
    await updateAuthSyncState(user.uid, true);

    return userCredential;
  }

  async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await updateAuthSyncState(userCredential.user.uid, true);
    return userCredential;
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      await ensureUserDocument(result.user, 'google');
      await updateAuthSyncState(result.user.uid, true);
      return result;
    } catch (popupError: any) {
      if (
        popupError?.code === 'auth/popup-blocked' ||
        popupError?.code === 'auth/cancelled-popup-request' ||
        popupError?.message?.includes('popup')
      ) {
        await signInWithRedirect(auth, provider);
        return null;
      }
      throw popupError;
    }
  }

  async function loginWithGithub() {
    const provider = new GithubAuthProvider();
    provider.setCustomParameters({ allow_signup: 'true' });

    try {
      const result = await signInWithPopup(auth, provider);
      await ensureUserDocument(result.user, 'github');
      await updateAuthSyncState(result.user.uid, true);
      return result;
    } catch (popupError: any) {
      if (
        popupError?.code === 'auth/popup-blocked' ||
        popupError?.code === 'auth/cancelled-popup-request' ||
        popupError?.message?.includes('popup')
      ) {
        await signInWithRedirect(auth, provider);
        return null;
      }
      throw popupError;
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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (unsubscribeSync) {
        unsubscribeSync();
        unsubscribeSync = null;
      }

      setCurrentUser(user);
      setLoading(false);

      if (!user) return;

      const lastSignInMs = user.metadata?.lastSignInTime
        ? new Date(user.metadata.lastSignInTime).getTime()
        : Date.now();

      unsubscribeSync = onSnapshot(
        getAuthSyncRef(user.uid),
        async (snapshot) => {
          const data = snapshot.data();
          if (!data || data.loggedIn !== false) return;

          const updatedAtMs = data?.updatedAt?.toMillis?.() || 0;
          if (updatedAtMs >= lastSignInMs - 5000 && auth.currentUser) {
            await signOut(auth);
          }
        },
        (error) => {
          if (error?.code === 'permission-denied') {
            console.warn('⚠️ Auth sync listener permission denied. Cross-site logout sync unavailable.');
            return;
          }
          console.error('Auth sync listener error:', error);
        }
      );
    });

    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result) return;

        const providerId = result.providerId === 'github.com' ? 'github' : 'google';
        await ensureUserDocument(result.user, providerId);
        await updateAuthSyncState(result.user.uid, true);
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
    };

    handleRedirectResult();

    return () => {
      unsubscribe();
      if (unsubscribeSync) unsubscribeSync();
    };
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      signup,
      login,
      loginWithGoogle,
      loginWithGithub,
      logout,
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
