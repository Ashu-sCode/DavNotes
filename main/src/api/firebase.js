import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBaFB0vPTYlfTbMkb3xnYTtOcDFp9EDo7c",
  authDomain: "notes-app-c26d3.firebaseapp.com",
  projectId: "notes-app-c26d3",
  storageBucket: "notes-app-c26d3.firebasestorage.app",
  messagingSenderId: "202517386840",
  appId: "1:202517386840:web:edf93070daece61db71c2d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
