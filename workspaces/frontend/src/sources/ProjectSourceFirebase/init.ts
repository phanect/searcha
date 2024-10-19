import { atom } from "jotai";
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

if (
  import.meta.env.VITE_ENV !== "production"
  && import.meta.env.VITE_ENV !== "staging"
  && import.meta.env.VITE_ENV !== "development"
) {
  throw new Error(`Unexpected VITE_ENV value: "${ import.meta.env.VITE_ENV }"`);
}

const projectId = `phanect-datasheet-${ import.meta.env.VITE_ENV }`;

export const envConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_PROJECT_WEB_API_KEY,
  authDomain: `${ projectId }.firebaseapp.com`,
  databaseURL: `https://${ projectId }.firebaseio.com`,
  projectId,
  storageBucket: `${ projectId }.appspot.com`,
};

/**
 * Store Firebase config here so it can be set programmatically.
 * This lets us switch between Firebase projects.
 * Root atom from which app, auth, db, storage are derived.
 */
export const firebaseConfigAtom = atom<FirebaseOptions>(envConfig);

/** Store Firebase app instance */
export const firebaseAppAtom = atom((get) => {
  const firebaseConfig = get(firebaseConfigAtom);
  return initializeApp(firebaseConfig, firebaseConfig.projectId);
});

/**
 * Store Firebase Auth instance for current app.
 * Connects to emulators based on env vars.
 */
export const firebaseAuthAtom = atom((get) => getAuth(get(firebaseAppAtom)));

/**
 * Store Firestore instance for current app.
 * Connects to emulators based on env vars, or enables multi-tab indexed db persistence.
 */
export const firebaseDbAtom = atom((get) => initializeFirestore(get(firebaseAppAtom), {
  ignoreUndefinedProperties: true,
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
}));

/**
 * Store Firebase Storage instance for current app.
 * Connects to emulators based on env vars.
 */
export const firebaseStorageAtom = atom((get) => getStorage(get(firebaseAppAtom)));

/**
 * Store Firebase Functions instance for current app.
 */
export const firebaseFunctionsAtom = atom((get) =>
  getFunctions(get(firebaseAppAtom))
);
