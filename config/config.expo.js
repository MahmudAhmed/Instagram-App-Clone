import * as firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD64mYesSD0AdzHc6fa5CDDO44ClUQagec",
  authDomain: "myfirstproject-772ad.firebaseapp.com",
  databaseURL: "https://myfirstproject-772ad.firebaseio.com",
  projectId: "myfirstproject-772ad",
  storageBucket: "myfirstproject-772ad.appspot.com",
  messagingSenderId: "645777166192",
  appId: "1:645777166192:web:8bf870140621337a0f89b5"
};
 
// const app = firebase.initializeApp(firebaseConfig); 
export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// export const f = firebase;
export const db = firebase.firestore();
export const auth = firebase.auth();
// export const storage = firebase.storage(); 
