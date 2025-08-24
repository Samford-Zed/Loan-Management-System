import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    port: 5173,
    proxy: {
      // forward API calls to Spring Boot on 8081 during dev
      "^/(admin|login|register|forgotPassword|resetPassword)": {
        target: "http://localhost:8081",
        changeOrigin: true,
        secure: false,
      },
      // If later you move APIs under /api, just uncomment this:
      // "/api": {
      //   target: "http://localhost:8081",
      //   changeOrigin: true,
      //   secure: false,
      // },
    },
  },
});
