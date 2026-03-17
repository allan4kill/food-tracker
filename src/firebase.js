// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdLvJOsEGMsbBxdd32GlRJVKyXzPutTyM",
  authDomain: "foodtracker-c5058.firebaseapp.com",
  projectId: "foodtracker-c5058",
  storageBucket: "foodtracker-c5058.firebasestorage.app",
  messagingSenderId: "278882674660",
  appId: "1:278882674660:web:9633f18f159019a65289f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);