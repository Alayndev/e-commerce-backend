import admin from "firebase-admin";

var serviceAccount = JSON.parse(process.env.FIRESBASE_CONNECTION as string);

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firestore = admin.firestore();

export { firestore };
