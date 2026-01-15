import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";



const firebaseConfig = {
  apiKey: "AIzaSyCDBd6zW1ZYazz0MKRWM0rYyhO6pZrmNnI",
  authDomain: "red-renal-ader-e2ebd.firebaseapp.com",
  projectId: "red-renal-ader-e2ebd",
  storageBucket: "red-renal-ader-e2ebd.firebasestorage.app",
  messagingSenderId: "959456011004",
  appId: "1:959456011004:web:372435227b18effc35ad79",
  databaseURL: "https://red-renal-ader-e2ebd-default-rtdb.firebaseio.com"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getDatabase(app);