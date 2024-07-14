import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, connectAuthEmulator, signOut, 
  GoogleAuthProvider, signInWithPopup, 
  createUserWithEmailAndPassword, updateProfile,
  signInWithEmailAndPassword, 
  deleteUser
} from "firebase/auth";

import {
  getFirestore,
  connectFirestoreEmulator,
  Timestamp,
  addDoc,
  getAggregateFromServer,
  collection,
  setDoc,
  average,
  doc,
  sum,
  count,
  limit,
  updateDoc,
  orderBy,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc
} from "firebase/firestore";

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
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getFirestore(app);

// //Dev Mode
// if (
//   window.location.hostname.includes("127.0.0.1") ||
//   window.location.hostname.includes("localhost")
// ) {
//   connectAuthEmulator(auth, "http://127.0.0.1:9099");
//   connectFirestoreEmulator(database, "127.0.0.1", 8080);
// }
// //...Dev Mode End

export async function createNewUserInFirestore(user) {
  const userData = {
    displayName: user.displayName,
    email: user.email,
    highestWPM10: 0,
    highestWPM20: 0,
    highestWPM30: 0,
    averageWPM: 0,
    averageAccuracy: 0,
    lessons: 0,
    totalErrors: 0,
    totalTimeInSec: 0,
  };
  try {
    await setDoc(doc(database, "Users", user.email), userData);
  } catch (error) {
    console.error(error);
  }
}
export async function signUpWithEmail(event, user, setIndicator){
  event.preventDefault();
  try{
    let isValid = await validSignUp(user, setIndicator);
    if(isValid){
      signUpSuccess(user, setIndicator);
    }
  }catch(error){
    console.error(error)
  }
}

export async function loginUserWithEmail(event, email, password, setIndicator) {
  event.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error.message === "Firebase: Error (auth/user-not-found)."){
      return setIndicator('User Not Found.')
    }
      return setIndicator(error.message);
  }
}

async function validSignUp(user, setIndicator) {

  const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  //Valid password
  if (user.password.length < 6) {
    setIndicator("Password must be 6 characters or longer.");
    return false;
  }
  //If both passwords don't match
  if (user.password !== user.reEnterPassword) {
    setIndicator("Passwords do not match.");
    return false;
  }
  //Username correct format
  if(!validFormatUserName(user.displayName, setIndicator)){
    return false;
  }
  //correct email format
  if (!validEmailRegex.test(user.email)) {
    setIndicator("Not a valid email format.");
    return false;
  }

  //Email exists
  const docRef = doc(database, "Users", user.email);
  const doesDocumentExist = await getDoc(docRef);
  if (doesDocumentExist.exists()) {
    setIndicator("Email is already in use.");
    return false;
  }

  if(await userNameIsTaken(user.displayName)){
    setIndicator("Username is taken. Try another.");
    return false;
  }
  return true;
}

export function validFormatUserName(userName, setIndicator) {
  const validUsernameRegex = /^[A-Za-z0-9]+$/;

  //Username length needs to be between 1 and 16 characters
  if (userName.length < 1 || userName.length > 16) {
    setIndicator("Username must be between 1 - 16 characters.");
    return false;
  }
  //Username can't contain special characters
  if (!validUsernameRegex.test(userName)) {
    setIndicator("Username must only have letter and numbers.");
    return false;
  }
  return true;
}
export async function userNameIsTaken(displayName){
  const usersCol = collection(database, "Users");
  const userNameQuery = query(usersCol, where("displayName", "==", displayName), limit(1));
  const userNameSnapshot = await getDocs(userNameQuery);
  return !userNameSnapshot.empty;
}

export async function changeUsername(user, newDisplayName, setIndicator){
  //Change the username through auth and firestore
  try{
    const userRef = doc(database, `Users/${user.email}`);
    await updateProfile(user, {displayName: newDisplayName});
    await updateDoc(userRef, {displayName: newDisplayName});
    setIndicator("Successfully changed username")
  }catch(error){
    console.error(error);
    setIndicator("Something went wrong")
    return;
  }
}

async function signUpSuccess(user, setIndicator) {
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );
    await updateProfile(userCred.user, {displayName: user.displayName});
  } catch (error) {
    setIndicator("Email already in use.");
    return;
  }

  createNewUserInFirestore(user);
  setIndicator(`Successfully created: ${user.displayName}`);
}

export async function signUpWithGoogle(event, userName, setIndicator) {
  event.preventDefault();
  if(userName.length < 1 ){
    setIndicator("Need to add a username.");
    return;
  }
  if (!validFormatUserName(userName, setIndicator)) {
    return;
  }
  if (await userNameIsTaken(userName)) {
    setIndicator("Username is taken. Try another.");
    return;
  }
  try {
    let res = await signInWithPopup(auth, googleProvider);
    const userRef = doc(database, `Users/${res.user.email}`);
    const snapshot = await getDoc(userRef);
    if(snapshot.exists()){
      setIndicator("Account already exists. Logged in.");
      return;
    }else{
      await updateProfile(res.user,{displayName: userName});
      createNewUserInFirestore(res.user);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function loginWithGoogle(event, setIndicator, setPopUp) {
  event.preventDefault();
  try {
    const res = await signInWithPopup(auth, googleProvider);
    
    // Check if the email exists as a doc in Firestore
    const userRef = doc(database, `Users/${res.user.email}`);
    const snapShot = await getDoc(userRef);

    if (!snapShot.exists()) {
      await deleteUser(res.user);
      throw new Error("Email does not exist.");
    }
    setPopUp(false);
  } catch (error) {
    setIndicator("Account does not exist. Sign Up.");
    console.error(error);
  } 
}


export function logout(auth) {
  signOut(auth);
}

export async function removeUser(user){
  const colRef10 = collection(database, `Users/${user.email}/lessonHistory10`);
  const colRef20 = collection(database, `Users/${user.email}/lessonHistory20`);
  const colRef30 = collection(database, `Users/${user.email}/lessonHistory30`);
  
  const userDataSnapshot = [
    getDocs(colRef10),
    getDocs(colRef20),
    getDocs(colRef30)
  ]
  const userDataPromise = await Promise.all(userDataSnapshot);

  const deletePromises = []; 
  userDataPromise.forEach((collection)=>{
    collection.forEach((document)=> {
      deletePromises.push(deleteDoc(document.ref))
    })
  })

  await Promise.all(deletePromises);

  //Deleting main user
  const userRef = doc(database, `Users/${user.email}`);
  await deleteDoc(userRef);

  //Delete Auth
  deleteUser(user);

}

export function createFirebaseTimestamp() {
  return Timestamp.now().seconds * 1000;
}

export async function sendToPhraseDatabase(user, phraseData) {
  if (user === null) return;
  const colRef = collection(
    database,
    "Users",
    user.email,
    `lessonHistory${phraseData.completedWords}`
  );
  try {
    await addDoc(colRef, phraseData);
  } catch (error) {
    console.error(error);
  }
}

export async function getUserStats(user) {
  if (user === null) return;
  try {
    const collections = {
      col10 : collection(database, `Users/${user.email}/lessonHistory10`),
      col20 : collection(database, `Users/${user.email}/lessonHistory20`),
      col30 : collection(database, `Users/${user.email}/lessonHistory30`)
    };
    const highestWPM = [
      (getDocs(getHighestWPM(collections.col10))),
      (getDocs(getHighestWPM(collections.col20))),
      (getDocs(getHighestWPM(collections.col30)))
    ]

    //In object form
    const promises = Object.values(collections).map(col => 
      getAggregateFromServer(col, {
        averageWPM: average("WPM"),
        averageAccuracy: average("accuracy"),
        totalErrors: sum("errors"),
        lessons: count(),
        totalTimeInSec: sum("phraseRunTime")
      })
    );

    let resultCollections = await Promise.all(promises);
    let resultHighestWPM = await Promise.all(highestWPM);

    if (!resultCollections) { throw "Could not get all Collection Data." };
    if (!resultHighestWPM) { throw "Could not get all HWPM Data." };

    return calculateOverallStats(resultCollections, resultHighestWPM);
  } catch (error) {
    console.error(error);
  }
}

function getHighestWPM(collection){
  return query(collection, orderBy('WPM', 'desc'), limit(1));
}

function calculateOverallStats(collectionData, highestWPMData){
  let updatedCollections = collectionData.map((element) => {
    const data = element.data();
    return {
      averageWPM: typeof data.averageWPM === 'number' ? data.averageWPM : 0,
      averageAccuracy: typeof data.averageAccuracy === 'number' ? data.averageAccuracy : 0,
      totalErrors: data.totalErrors,
      lessons: data.lessons,
      totalTimeInSec: data.totalTimeInSec
    };
  });
  updatedCollections = handleEmptyCollections(updatedCollections);

  const combinedUserStats = {
    highestWPM10 : highestWPMData[0].docs[0]?.data().WPM ?? 0,        
    highestWPM20 : highestWPMData[1].docs[0]?.data().WPM ?? 0,
    highestWPM30 : highestWPMData[2].docs[0]?.data().WPM ?? 0,
    averageAccuracy: 0,
    averageWPM: 0,
    totalErrors: 0,
    lessons: 0,
    totalTimeInSec: 0
  }
  updatedCollections.forEach((element) => {
    combinedUserStats.averageAccuracy += element.averageAccuracy;
    combinedUserStats.averageWPM += element.averageWPM;
    combinedUserStats.totalErrors += element.totalErrors;
    combinedUserStats.lessons += element.lessons;
    combinedUserStats.totalTimeInSec += element.totalTimeInSec;
  });
  //Getting Averages
  combinedUserStats.averageAccuracy /= updatedCollections.length;
  combinedUserStats.averageWPM /= updatedCollections.length;

  //Handles no lessons
  if(Number.isNaN(combinedUserStats.averageAccuracy)){combinedUserStats.averageAccuracy = 0};
  if(Number.isNaN(combinedUserStats.averageWPM)){combinedUserStats.averageWPM = 0};


  return combinedUserStats;
}
function handleEmptyCollections(collections){
  return collections.filter((col) => col.lessons !== 0);
}

export async function fetchStats(user, setStats){
  try{
    if (user) {
      let userStats = await getUserStats(user);
      if(!userStats){
        throw "Stats is does not exist"
      }
      updateScores(user, userStats);
      setStats(userStats);
    }
  }catch(error){
    console.error(error);
  }
}

export async function updateScores(user, stats) {
  const docRef = doc(database, `Users/${user.email}`)
  updateDoc(docRef, stats);
}

export async function loadLeaderboard(type) {
  try{
    let userCollection = collection(database, "Users");
    if (await isCollectionEmpty(userCollection)) return;
  
    const q =  query(userCollection, orderBy(type, 'desc'), limit(10));
  
    let docs = await getDocs(q);
    const leaderboard = [];
    docs.forEach((doc) => {
      leaderboard.push({ id: doc.id, ...doc.data() });
    });
  
    return leaderboard;
  }catch(error){
    console.error(error);
    return [];
  }
}

async function isCollectionEmpty(collection){
  let q = query(collection, limit(1));
  return (await getDocs(q)).empty;
}