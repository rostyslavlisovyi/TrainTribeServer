import { cert, getApps, initializeApp } from "firebase-admin/app";

const initializeFirebaseAdmin = (): void => {
  if (getApps().length > 0) {
    return;
  }

  const { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } =
    process.env;

  if (FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY && FIREBASE_PROJECT_ID) {
    initializeApp({
      credential: cert({
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        projectId: FIREBASE_PROJECT_ID
      })
    });
    return;
  }

  initializeApp();
};

initializeFirebaseAdmin();
