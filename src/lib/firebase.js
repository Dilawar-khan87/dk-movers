// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCz835Lb8ZUF-rYPSRhhrrHULxu2Xh-VqI",
  authDomain: "practisedk.firebaseapp.com",
  projectId: "practisedk",
  storageBucket: "practisedk.firebasestorage.app",
  messagingSenderId: "126422523782",
  appId: "1:126422523782:web:f9cd946869156ffed69607"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db ,storage ,app};