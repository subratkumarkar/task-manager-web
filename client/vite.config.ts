import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    root: __dirname,
    plugins: [react()],

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },

    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
        css: true,
    },

    build: {
        outDir: path.resolve(__dirname, "dist"),
        emptyOutDir: true,
    },

    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:3001",
                changeOrigin: true,
            },
        },
    },
});
