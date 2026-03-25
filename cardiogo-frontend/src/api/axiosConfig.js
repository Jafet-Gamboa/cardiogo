import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: apiURL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Error en la petición:", error);
        return Promise.reject(error);
    }
);

export default axiosInstance;