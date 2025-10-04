// App.jsx - VERSÃO COM TESTE DE TOKEN NO CONSOLE
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import OnboardingStep2 from './OnboardingStep2'; 

// Função auxiliar para o endereço do backend
const API_URL = 'http://127.0.0.1:5000';

const Login = ({ setToken }  ) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
            const data = await response.json();
            setToken(data.token);
            navigate('/onboarding-step1');
        } else {
            alert('Falha no login');
        }
    };
    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required />
                <button type="submit">Entrar</button>
            </form>
            <p>Não tem uma conta? <a href="/register">Registre-se</a></p>
        </div>
    );
};

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
            navigate('/login');
        } else {
            alert('Falha no registro');
        }
    };
    return (
        <div className="form-container">
            <h2>Registro</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required />
                <button type="submit">Registrar</button>
            </form>
             <p>Já tem uma conta? <a href="/login">Login</a></p>
        </div>
    );
};

const OnboardingStep1 = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('male');
    const [activityLevel, setActivityLevel] = useState('sedentary');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        // ==================================================================
        // A LINHA DE TESTE QUE O COLABORADOR SUGERIU ESTÁ AQUI
        console.log('Token que está sendo enviado:', token);
        // ==================================================================

        const response = await fetch(`${API_URL}/api/onboarding-step1`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({ 
                name, 
                age: parseInt(age), 
                weight: parseFloat(weight), 
                height: parseInt(height), 
                gender, 
                activity_level: activityLevel 
            }),
        });

        if (response.ok) {
            navigate('/onboarding-step2');
        } else {
            alert('Falha ao enviar dados. Verifique o console e o terminal do backend.');
        }
    };

    return (
        <div className="form-container">
            <h2>Passo 1: Informações Pessoais</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" required />
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Idade" required />
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Peso (kg)" required />
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Altura (cm)" required />
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="male">Masculino</option>
                    <option value="female">Feminino</option>
                </select>
                <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                    <option value="sedentary">Sedentário</option>
                    <option value="light">Leve</option>
                    <option value="moderate">Moderado</option>
                    <option value="active">Ativo</option>
                    <option value="very_active">Muito Ativo</option>
                </select>
                <button type="submit">Próximo</button>
            </form>
        </div>
    );
};

const Dashboard = () => {
    return (
        <div className="form-container">
            <h2>Dashboard</h2>
            <p>Bem-vindo! Sua dieta foi configurada com sucesso.</p>
        </div>
    );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleSetToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={handleSetToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding-step1" element={token ? <OnboardingStep1 /> : <Navigate to="/login" />} />
        <Route path="/onboarding-step2" element={token ? <OnboardingStep2 /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
