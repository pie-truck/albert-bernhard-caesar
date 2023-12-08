/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: "./src/setupTests.ts",
    globals: true,
    environment: "jsdom",
  },
})
