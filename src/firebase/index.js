import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "./config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const imageDb = getStorage(app);

export { db, imageDb };
