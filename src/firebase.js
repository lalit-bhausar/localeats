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
  apiKey: "AIzaSyBld5pyMVMqcBEBHVYBPs0YX4CU5uNr0y8",
  authDomain: "localeats-48917.firebaseapp.com",
  projectId: "localeats-48917",
  storageBucket: "localeats-48917.firebasestorage.app",
  messagingSenderId: "403237180648",
  appId: "1:403237180648:web:7d0367ab6236e469fde55d",
  measurementId: "G-NFTLV6BCSJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
