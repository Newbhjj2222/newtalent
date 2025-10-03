// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAvwNyhKiKFyI-r6MDDk7BH3iq7P61z594",
  authDomain: "newtalents-a7c29.firebaseapp.com",
  projectId: "newtalents-a7c29",
  storageBucket: "newtalents-a7c29.appspot.com",
  messagingSenderId: "507408992610",
  appId: "1:507408992610:web:05ce220a4cb4922de9843b",
  measurementId: "G-XZVMTFEQBE"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification?.title || "New post";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/logo.png",
    data: payload.data || {}
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
