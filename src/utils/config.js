// config.js - Smart environment detection
const isDevelopment = import.meta.env.DEV;
const isLocalBackendRunning = import.meta.env.VITE_USE_LOCAL_BACKEND === "true";

export const BASE_URL = isLocalBackendRunning
  ? "http://localhost:4000/api/v1"
  : "https://travel-backend-ashen-nine.vercel.app/api/v1";

console.log("Using API URL:", BASE_URL);
