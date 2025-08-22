/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyAvwNyhKiKFyI-r6MDDk7BH3iq7P61z594",
  authDomain: "newtalents-a7c29.firebaseapp.com",
  projectId: "newtalents-a7c29",
  storageBucket: "newtalents-a7c29.appspot.com",
  messagingSenderId: "507408992610",
  appId: "1:507408992610:web:05ce220a4cb4922de9843b"
});

const messaging = firebase.messaging();

// Notifications igihe site ifunze cyangwa iri background
messaging.onBackgroundMessage((payload) => {
  console.log("Background message ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png" // shyiramo icon yawe
  });
});
