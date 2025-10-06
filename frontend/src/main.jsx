// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// ===== A CORREÇÃO DEFINITIVA =====
// Importando o nosso arquivo de estilos principal no ponto de entrada da aplicação.
// Isso garante que o CSS seja carregado e aplicado a todos os componentes.
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
