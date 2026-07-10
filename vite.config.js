import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    server: {
        // Bind ke IPv4 loopback, bukan [::1], supaya hot file memakai
        // http://127.0.0.1:5173 dan tidak kena "can't detect preamble" di Windows.
        host: "127.0.0.1",
        port: 5173,
        strictPort: true,
    },
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
    ],
});
