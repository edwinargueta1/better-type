// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator, signOut } from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  Timestamp,
  addDoc,
  getAggregateFromServer,
  collection,
  setDoc,
  average,
  getCountFromServer,
  doc,
  firestoreQuery,
  sum,
  count,
  limit,
  updateDoc,
  orderBy,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth/cordova";
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
//...Dev Mode End

export async function createNewUserInFirebase(data) {
  try {
    const docRef = await setDoc(doc(database, "Users", data.userName), data);
    // console.log("Document Created with: ", docRef.id);
  } catch (error) {
    console.error(error);
  }
}

export function logout(auth) {
  signOut(auth);
  console.log("Signed out.");
}
export function createFirebaseTimestamp() {
  return Timestamp.now().seconds * 1000;
}

export async function sendToPhraseDatabase(user, phraseData) {
  if (user === null) return;
  const colRef = collection(
    database,
    "Users",
    user.displayName,
    "lessonHistory"
  );
  try {
    await addDoc(colRef, phraseData);
  } catch (error) {
    console.error(error);
  }
}

export async function getUserStats(user) {
  if (user === null) return;
  // console.log(user.displayName);
  try {
    const col = collection(database, `Users/${user.displayName}/lessonHistory`);
    // console.log(col);

    const snapCount = await getCountFromServer(col);
    // console.log(snapCount.data().count);

    // const average = await getAggregateFromServer(query())

    const snap = await getAggregateFromServer(col, {
      averageWPM: average("WPM"),
      averageAccuracy: average("accuracy"),
      totalErrors: sum("errors"),
      lessons: count(),
      totalTime: sum("phraseRunTime"),
    });
    const data = {//Edit-------------
      averageWPM: ( typeof snap.data().averageWPM === 'number') ?  snap.data().averageWPM : 0,
      averageAccuracy: ( typeof snap.data().averageAccuracy === 'number') ? snap.data().averageAccuracy : 0,
      totalErrors: snap.data().totalErrors,
      lessons: snap.data().lessons,
      totalTime: snap.data().totalTime

    }

    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateProfile(user, stats) {
  const docRef = doc(database, `Users/${user.displayName}`)
  updateDoc(docRef, stats);
}
export async function loadLeaderboard() {
  let userCollection = collection(database, "Users");
  let doesCollectionExists = (await getDocs(userCollection)).empty;

  if (doesCollectionExists) return;
  const q =  query(userCollection, orderBy('averageWPM', 'desc'), limit(3));
  let docs = await getDocs(q);
  const leaderboard = [];
  docs.forEach((doc) => {
    leaderboard.push({ id: doc.id, ...doc.data() });
  });
  console.log(leaderboard)
  return leaderboard;
}