// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "wad-auth.firebaseapp.com",
  projectId: "wad-auth",
  storageBucket: "wad-auth.firebasestorage.app",
  messagingSenderId: "53400502777",
  appId: "1:53400502777:web:ee55368a6ccd42adb1fd28",
  measurementId: "G-VYHH7TTMLJ",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
