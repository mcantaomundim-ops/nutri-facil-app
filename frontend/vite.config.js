// vite.config.js - A VERSÃO CORRETA E FINAL
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( )],
  server: {
    proxy: {
      // Redireciona qualquer requisição que comece com /api para o backend
      '/api': {
        target: 'http://127.0.0.1:5000', // Usando o IP explícito
        changeOrigin: true,
        secure: false, // Não verificar certificados SSL
      },
    },
  },
} )
