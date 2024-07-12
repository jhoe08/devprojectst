// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByRSup_NH_xWYufEaCRUF-xwdsM7KM3lQ",
  authDomain: "da07-8d63a.firebaseapp.com",
  databaseURL: "https://da07-8d63a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "da07-8d63a",
  storageBucket: "da07-8d63a.appspot.com",
  messagingSenderId: "714326705556",
  appId: "1:714326705556:web:8c4d80feb3d595e114fb81",
  measurementId: "G-FY5Z6EFD0R"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebase);