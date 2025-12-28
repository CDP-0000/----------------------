import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tailwindcss from "@tailwindcss/vite" // <--- บรรทัดนี้คือหัวใจของ v4

export default defineConfig({
  plugins: [react(), tailwindcss()],
})