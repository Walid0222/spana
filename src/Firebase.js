// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_i4FwiHTHufNFbaG1ZRbN3IhF7z2eYD8",
  authDomain: "spana-290e9.firebaseapp.com",
  projectId: "spana-290e9",
  storageBucket: "spana-290e9.firebasestorage.app",
  messagingSenderId: "798355527087",
  appId: "1:798355527087:web:ba8859fa86294363824b5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firestore instance
export { db };