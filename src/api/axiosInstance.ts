import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Ajuste si nécessaire
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = 'Token ${token}';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;