// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7R1sdzqbyxCkG8mToZrkPZ5lzH8lapoY",
  authDomain: "routewise-colab24.firebaseapp.com",
  projectId: "routewise-colab24",
  storageBucket: "routewise-colab24.appspot.com",
  messagingSenderId: "468980435482",
  appId: "1:468980435482:web:c8c703375798207633dfa3",
  measurementId: "G-EJXYYS3KBN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const firestore = getFirestore(app);
const analytics = getAnalytics(app);
// export default auth;




