import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: Change "f1-dashboard" below to match your GitHub repo name.
// If your repo is github.com/yourname/my-f1-app, set base to "/my-f1-app/".
export default defineConfig({
  plugins: [react()],
  base: '/f1-dashboard/',
})
