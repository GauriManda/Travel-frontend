import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://travel-backend-9hrb4ffzg-gauri-mandas-projects.vercel.app",
        changeOrigin: true,
        secure: true,
        // REMOVED: rewrite rule that was stripping /api
        // The backend expects /api in the path, so don't remove it
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
