import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";


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

// Initialize Cloud Firestore and get a reference to the service
const firestore = getFirestore(app);





