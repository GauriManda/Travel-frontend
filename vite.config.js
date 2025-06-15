import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://travel-backend-otxji7vrg-gauri-mandas-projects.vercel.app", // Updated URL
        changeOrigin: true,
        secure: true,
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("Proxying request to:", options.target + req.url);
          });
        },
      },
    },
  },
});
