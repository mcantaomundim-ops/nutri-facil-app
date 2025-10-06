// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PageLayout from './PageLayout';

const API_URL = 'http://127.0.0.1:5000';

const Register = ( ) => {
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
            toast.success('Registro realizado com sucesso! Faça o login.');
            navigate('/login');
        } else {
            toast.error('Falha no registro. O email pode já estar em uso.');
        }
    };

    return (
      <PageLayout>
        <div className="form-container">
            <h2>Crie sua conta</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required />
                <button type="submit">Registrar</button>
            </form>
             <p>Já tem uma conta? <a href="/login">Login</a></p>
        </div>
      </PageLayout>
    );
};

export default Register;
