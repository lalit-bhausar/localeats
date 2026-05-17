// ===========================================
// FIREBASE CONFIGURATION
// ===========================================
// To set up Firebase:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project called "LocalEats"
// 3. Add a Web App and copy the config below
// 4. Enable Authentication (Email/Password + Phone)
// 5. Create a Firestore Database
// 6. Enable Storage
// ===========================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // REPLACE THESE WITH YOUR FIREBASE PROJECT CONFIG
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
