import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // 👈 This is crucial to allow cookies to be sent/received
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
