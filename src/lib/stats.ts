import { doc, getDoc, setDoc, updateDoc, onSnapshot, increment, setDoc as firestoreSetDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface StatsData {
  views: number;
  hearts: number;
}

// Global Stats
export const incrementGlobalViews = async () => {
  const path = 'global_stats/main';
  try {
    const docRef = doc(db, 'global_stats', 'main');
    await setDoc(docRef, {
      views: increment(1),
      hearts: increment(0) // Ensure field exists
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const incrementGlobalHearts = async () => {
  const path = 'global_stats/main';
  try {
    const docRef = doc(db, 'global_stats', 'main');
    await setDoc(docRef, {
      hearts: increment(1)
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const decrementGlobalHearts = async () => {
  const path = 'global_stats/main';
  try {
    const docRef = doc(db, 'global_stats', 'main');
    await setDoc(docRef, {
      hearts: increment(-1)
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const subscribeGlobalStats = (callback: (data: StatsData) => void) => {
  const path = 'global_stats/main';
  const docRef = doc(db, 'global_stats', 'main');
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      callback({
        views: data.views || 0,
        hearts: data.hearts || 0
      });
    } else {
      // Initialize if not exists
      setDoc(docRef, { views: 0, hearts: 0 }).catch(err => {
        console.error('Error initializing global stats', err);
      });
      callback({ views: 0, hearts: 0 });
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

// Cause-Specific Stats
export const incrementCauseViews = async (causeId: string) => {
  const path = `cause_stats/${causeId}`;
  try {
    const docRef = doc(db, 'cause_stats', causeId);
    await setDoc(docRef, {
      views: increment(1),
      hearts: increment(0)
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const incrementCauseHearts = async (causeId: string) => {
  const path = `cause_stats/${causeId}`;
  try {
    const docRef = doc(db, 'cause_stats', causeId);
    await setDoc(docRef, {
      hearts: increment(1)
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const decrementCauseHearts = async (causeId: string) => {
  const path = `cause_stats/${causeId}`;
  try {
    const docRef = doc(db, 'cause_stats', causeId);
    await setDoc(docRef, {
      hearts: increment(-1)
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const subscribeCauseStats = (causeId: string, callback: (data: StatsData) => void) => {
  const path = `cause_stats/${causeId}`;
  const docRef = doc(db, 'cause_stats', causeId);
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      callback({
        views: data.views || 0,
        hearts: data.hearts || 0
      });
    } else {
      // Initialize if not exists
      setDoc(docRef, { views: 0, hearts: 0 }).catch(err => {
        console.error(`Error initializing stats for ${causeId}`, err);
      });
      callback({ views: 0, hearts: 0 });
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};
