import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, doc, getDocs, addDoc, deleteDoc, orderBy, query, onSnapshot  } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCV1LRC7Ay-tmjQJCsrVwr2P1GhvZGBuco",
  authDomain: "fetpizza-7be02.firebaseapp.com",
  projectId: "fetpizza-7be02",
  storageBucket: "fetpizza-7be02.appspot.com",
  messagingSenderId: "3035787533",
  appId: "1:3035787533:web:7a6ac2f74757a2d320c044"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {
    app,
    auth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    db,
    collection,
    doc,
    getDocs,
    addDoc,
    deleteDoc,
    orderBy,
    query,
    onSnapshot
}