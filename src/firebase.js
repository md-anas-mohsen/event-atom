// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqDm-cPEvpmVmEuZoEygNJjl9GKOUg7jk",
  authDomain: "events-atom.firebaseapp.com",
  projectId: "events-atom",
  storageBucket: "events-atom.appspot.com",
  messagingSenderId: "441599442776",
  appId: "1:441599442776:web:82530bc81b9d95d449ef2d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
