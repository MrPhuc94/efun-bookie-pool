/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging

importScripts("https://www.gstatic.com/firebasejs/8.9.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.9.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyCvt-jQ5gX83VkEknO7QFMZ6en_b8FE6W0",
  authDomain: "furamafacility.firebaseapp.com",
  projectId: "furamafacility",
  storageBucket: "furamafacility.appspot.com",
  messagingSenderId: "991809847610",
  appId: "1:991809847610:web:650d6d9d57572438d21003",
  measurementId: "G-RL9JXYBFHK",
};

firebase.initializeApp(firebaseConfig);
const message = firebase.messaging();
