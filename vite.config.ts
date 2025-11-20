// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    root: path.resolve(__dirname, "client/src"),
    build: {
        outDir: path.resolve(__dirname, "client/dist"),
        emptyOutDir: true,
    },
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:3001",
                changeOrigin: true,
            }
        }
    }
});
