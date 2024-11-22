// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByz0Y7ojGLUqry9oOddCsjYVeMqJEB4zo",
  authDomain: "waystories-cae8a.firebaseapp.com",
  projectId: "waystories-cae8a",
  storageBucket: "waystories-cae8a.firebasestorage.app",
  messagingSenderId: "327483750879",
  appId: "1:327483750879:web:0cf874cd755a9c61b3ac6a",
  measurementId: "G-ZQ0EKR94K6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };