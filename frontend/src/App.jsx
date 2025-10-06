// App.jsx - VERSÃO FINAL REFATORADA (CSS Limpo)
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// A LINHA 'import "./App.css";' FOI REMOVIDA DAQUI

// IMPORTANDO TODOS OS COMPONENTES DE SEUS PRÓPRIOS ARQUIVOS
import Login from './components/Login';
import Register from './components/Register';
import OnboardingStep1 from './components/OnboardingStep1';
import OnboardingStep2 from './components/OnboardingStep2';
import EditProfile from './components/EditProfile';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleSetToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
    setToken(newToken);
  };

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login setToken={handleSetToken} />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas Protegidas */}
        <Route 
          path="/onboarding-step1" 
          element={token ? <OnboardingStep1 /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/onboarding-step2" 
          element={token ? <OnboardingStep2 /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard setToken={handleSetToken} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/edit-profile" 
          element={token ? <EditProfile /> : <Navigate to="/login" />} 
        />

        {/* Rota Padrão */}
        <Route 
          path="/" 
          element={<Navigate to={token ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
