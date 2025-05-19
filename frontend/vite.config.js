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
    server: {
        proxy: {
            "/api": {
                target: process.env.VITE_API_BASE_URL, // Use the environment variable
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
    define: {
        "process.env": process.env,
    },
})
