import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],

    root: path.resolve(__dirname, 'src/client'),

    build: {
        outDir: path.resolve(__dirname, 'dist/client'),
        emptyOutDir: true,
    },

    server: {
        port: 3000,   // React dev server
        proxy: {
            '/api': {
                target: 'http://localhost:3001', // 👈 Express server
                changeOrigin: true,
                secure: false,
            },
        },
    },
})
