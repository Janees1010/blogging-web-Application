
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyAcTK3IbZm2ScS7nKi8tGJXe6swLpXteVQ",
  authDomain: "recat-js-blog.firebaseapp.com",
  projectId: "recat-js-blog",
  storageBucket: "recat-js-blog.appspot.com",
  messagingSenderId: "726648168841",
  appId: "1:726648168841:web:5a28bd1ee178ac0e9c4158"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// google auth 

const provider = new GoogleAuthProvider()
const auth = getAuth()

 export const authGoogle = async ()=>{
       let user = null;
       await signInWithPopup(auth,provider).then((response)=>{
        user= response.user
     }).catch(err=>{
        console.log(err);
     })
     return user
}