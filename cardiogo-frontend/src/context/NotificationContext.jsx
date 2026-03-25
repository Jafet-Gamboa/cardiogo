import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { onMessage } from "firebase/messaging";
import { messaging } from '../firebase';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
    const newNotification = { id: Date.now(), ...notification };
        setNotifications(prev => {
            if (prev.some(n => n.title === newNotification.title && n.body === newNotification.body)) {
                return prev;
            }
            return [newNotification, ...prev];
        });
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const addNotificationRef = useRef(addNotification);
    useEffect(() => {
        addNotificationRef.current = addNotification;
    });

    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log("Notificación foreground:", payload);
            addNotificationRef.current({
                ...payload.notification,
                ...payload.data
            });
        });

        const handleSWMessages = (event) => {
            if (event.data?.type === "new-notification") {
                console.log("Notificación desde SW:", event.data.data);
                addNotificationRef.current(event.data.data);
            }
        };

        navigator.serviceWorker.addEventListener("message", handleSWMessages);

        return () => {
            unsubscribe();
            navigator.serviceWorker.removeEventListener("message", handleSWMessages);
        };
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications,
            addNotification,
            removeNotification,
            clearAllNotifications
        }}>
        {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    return useContext(NotificationContext);
}
