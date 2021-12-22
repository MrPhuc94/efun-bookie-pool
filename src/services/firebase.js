import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: "AIzaSyCvt-jQ5gX83VkEknO7QFMZ6en_b8FE6W0",
  authDomain: "furamafacility.firebaseapp.com",
  projectId: "furamafacility",
  storageBucket: "furamafacility.appspot.com",
  messagingSenderId: "991809847610",
  appId: "1:991809847610:web:650d6d9d57572438d21003",
  measurementId: "G-RL9JXYBFHK",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.

export const messaging = getMessaging(firebaseApp);
