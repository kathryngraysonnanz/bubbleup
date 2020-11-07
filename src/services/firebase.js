import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDTYOpQXQePmrs6URwVASf7etQOgy5ZDnQ",
  authDomain: "bubbleup-ecae7.firebaseapp.com",
  databaseURL: "https://bubbleup-ecae7.firebaseio.com",
  projectId: "bubbleup-ecae7",
  storageBucket: "bubbleup-ecae7.appspot.com",
  messagingSenderId: "818950210973",
  appId: "1:818950210973:web:8b6d6c8e2da16fc49adb74",
  measurementId: "G-YPMM8RSKSP"
};


firebase.initializeApp(config);
export const auth = firebase.auth;
export const db = firebase.database();
