// src/components/Login.jsx
import React, { useState } from 'react';
// ===== 1. IMPORTAR O LINK =====
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PageLayout from './PageLayout';

// ===== APONTANDO PARA A API EM PRODUÇÃO (RENDER) =====
const API_URL = 'https://nutri-facil-backend.onrender.com'; 

const Login = ({ setToken }   ) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.token);
                if (data.is_onboarding_complete) {
                    navigate('/dashboard');
                } else {
                    navigate('/onboarding-step1');
                }
            } else {
                toast.error('Falha no login. Verifique seu email e senha.');
            }
        } catch (error) {
            toast.error('Não foi possível conectar ao servidor.');
        }
    };

    return (
      <PageLayout>
        <div className="form-container">
            <h2>Acesse sua conta</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required />
                <button type="submit">Entrar</button>
            </form>
            {/* ===== 2. SUBSTITUIR <a> POR <Link> ===== */}
            <p>Não tem uma conta? <Link to="/register">Registre-se</Link></p>
        </div>
      </PageLayout>
    );
};

export default Login;
