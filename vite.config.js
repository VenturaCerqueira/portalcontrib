import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    loader: 'jsx',
  },

  server: {
    cors: false,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https: http://fonts.googleapis.com data:; font-src 'self' https: https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' http://localhost:3001 ws://localhost:* https:;"
    }
  },

})

