import { messaging } from "../firebase";
import { getToken } from "firebase/messaging";

export const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    return permission === "granted";
};

export const getFcmToken = async () => {
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: "BHq56oUnaGqkX1Pr4USc39k7r4ICsSeapDkxkwyGUr0Ju2CAMe1zndYg7pZ48eIrdbcqHDsyK5sTAZU9zDCGWWM",
            serviceWorkerRegistration: await navigator.serviceWorker.ready
        });

        if (currentToken) {
            localStorage.setItem("FCMToken", currentToken);
            return currentToken;
        } else {
            console.warn("No se obtuvo el token.");
            return null;
        }
    } catch (err) {
        console.error("Error al obtener token FCM:", err);
        return null;
    }
};
