// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Use proxy in development, direct URL in production
const BASE_URL = isDevelopment
  ? "/api" // This will use the Vite proxy
  : "https://travel-backend-9hrb4ffzg-gauri-mandas-projects.vercel.app";

export { BASE_URL };
