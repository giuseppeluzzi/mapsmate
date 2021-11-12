import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDE1uKgx1_wdea1iLgZrv2Blw7A5F9uF3A",
  authDomain: "splits-962fa.firebaseapp.com",
  databaseURL:
    "https://splits-962fa-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "splits-962fa",
  storageBucket: "splits-962fa.appspot.com",
  messagingSenderId: "1013343439548",
  appId: "1:1013343439548:web:6828953b8764ec144c5eb9"
};

console.log("Firebase initialized");
initializeApp(firebaseConfig);
