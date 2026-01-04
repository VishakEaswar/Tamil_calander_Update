import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/Tamil_calander_Update/",
  build: {
    outDir: "docs",
    emptyOutDir: true
  },
  server: {
    host: true,
    port: 5174
  }
})
