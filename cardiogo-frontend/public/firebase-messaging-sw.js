importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBGp8zReNJ8Q2Ouc6vl7QzMwOwvAwNuYOQ",
    authDomain: "cardiogo-25118.firebaseapp.com",
    projectId: "cardiogo-25118",
    storageBucket: "cardiogo-25118.appspot.com",
    messagingSenderId: "947890695824",
    appId: "1:947890695824:web:9a3a9c2d11e9d41bd83215"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Mensaje en segundo plano:", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/logo192.png"
    };

    self.clients.matchAll({
        type: "window",
        includeUncontrolled: true
    }).then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: "new-notification",
                data: payload.notification
            });
        });
    });

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});
