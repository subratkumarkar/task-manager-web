import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],

    // Root of the React application
    root: path.resolve(__dirname, 'src/client'),

    // correct asset paths in production
    base: '/',

    build: {
        outDir: path.resolve(__dirname, 'dist/client'),
        emptyOutDir: true,

        // Ensures absolute paths work correctly
        assetsDir: 'assets',
        copyPublicDir: true,
    },

    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',   // Express server
                changeOrigin: true,
                secure: false,
            },
        },
    },
})
