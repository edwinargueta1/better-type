// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth/cordova";
import { doc, setDoc, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getFirestore(app);

//Dev Mode
if (
  window.location.hostname.includes("127.0.0.1") ||
  window.location.hostname.includes("localhost")
) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(database, "127.0.0.1", 8080);
}
//Dev Mode End

export async function createNewUserInFirebase(data) {
  try {
    const docRef = await setDoc(doc(database, "Users", data.userName), data);
    console.log("Document Created with: ", docRef.id);
  } catch (error) {
    console.error(error);
  }
}
export async function loginUser(email, password) {
  try {
    console.log("login user ran");
    const user = await signInWithEmailAndPassword(auth, email, password);
    console.log(user);
    const sobj = await signOut(auth);
    console.log(sobj);
  } catch (error) {
    console.log(error);
  }
}
export function logout() {}
