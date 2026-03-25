// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging";

// const firebaseConfig = {
//     apiKey: "AIzaSyBGp8zReNJ8Q2Ouc6vl7QzMwOwvAwNuYOQ",
//     authDomain: "cardiogo-25118.firebaseapp.com",
//     projectId: "cardiogo-25118",
//     storageBucket: "cardiogo-25118.firebasestorage.app",
//     messagingSenderId: "947890695824",
//     appId: "1:947890695824:web:9a3a9c2d11e9d41bd83215"
// };

// const app = initializeApp(firebaseConfig);
// export const messaging = getMessaging(app);

import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBGp8zReNJ8Q2Ouc6vl7QzMwOwvAwNuYOQ",
  authDomain: "cardiogo-25118.firebaseapp.com",
  projectId: "cardiogo-25118",
  storageBucket: "cardiogo-25118.firebasestorage.app",
  messagingSenderId: "947890695824",
  appId: "1:947890695824:web:9a3a9c2d11e9d41bd83215"
};

const app = initializeApp(firebaseConfig);

let messaging = null;

isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);
    console.log("Firebase Messaging habilitado");
  } else {
    console.warn("Firebase Messaging NO soportado en este navegador");
  }
});

export { app, messaging };
