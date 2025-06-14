import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import dotenv from "dotenv"

dotenv.config()

export default defineConfig({
    plugins: [react()],
    test:{
        environment: 'jsdom',
        globals: true,
    },
    optimizeDeps: {
        exclude: ['react-router-dom', 'react-hot-toast']
    },    server: {
        port: 5173,
        host: true,
        cors: true,
        proxy: {
            "/": {
                target: "https://wanderlust-frontend-8a4h.onrender.com",
                changeOrigin: true,
                secure: false,
                ws: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
    define: {
        "process.env": process.env,
    },
})
