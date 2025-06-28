// config.js - Smart environment detection
const isDevelopment = import.meta.env.DEV;
const useLocal = import.meta.env.VITE_USE_LOCAL_BACKEND === "true";
const envApiUrl = import.meta.env.VITE_API_URL;

export const BASE_URL =
  isDevelopment && useLocal ? "http://localhost:4000/api/v1" : envApiUrl;

console.log("Using API URL:", BASE_URL);
