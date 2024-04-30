// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuijJTauVbY8LI4uCRd1kxk5JQ0UV8Z_w",
  authDomain: "better-type.firebaseapp.com",
  projectId: "better-type",
  storageBucket: "better-type.appspot.com",
  messagingSenderId: "850005982436",
  appId: "1:850005982436:web:d9021d0f4dfaf6cfc5c0f1",
  measurementId: "G-5ZZ60DD1GS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
console.log(getAuth());
console.log(getAuth().currentUser);