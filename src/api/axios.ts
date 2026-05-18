import axios from "axios";

const api = axios.create({
  baseURL: "https://job-app-backend-1-4xx2.onrender.com/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default api;
