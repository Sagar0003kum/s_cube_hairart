import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6MXCBSjMcglGIJgd8K66NdjhlwMdLnOQ",
  authDomain: "fir-cube-hairart.firebaseapp.com",
  projectId: "fir-cube-hairart",
  storageBucket: "fir-cube-hairart.firebasestorage.app",
  messagingSenderId: "1006048309286",
  appId: "1:1006048309286:web:5dd1b525a4a2e1c90f76e7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
