// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCobM-uq4dfkIPFJiT3I9BsXhBSfOQh8O4",
  authDomain: "imarket-43840.firebaseapp.com",
  projectId: "imarket-43840",
  storageBucket: "imarket-43840.appspot.com",
  messagingSenderId: "476374687899",
  appId: "1:476374687899:web:ad277f3ec5e5fa52c0263e",
  measurementId: "G-SVZ44PLKN3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firestore instance
export { db };