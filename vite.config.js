import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [tailwindcss()],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'], // Expose NEXT_PUBLIC_ vars like Vercel's
  server: {
    host: '0.0.0.0',               // allow external/custom domains
    port: 5173,
    allowedHosts: ['local.myapp.com'] // 👈 whitelist your fake local domain
  }
})
