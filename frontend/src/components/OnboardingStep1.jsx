// src/components/OnboardingStep1.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PageLayout from './PageLayout';

// ===== APONTANDO PARA A API EM PRODUÇÃO (RENDER) =====
const API_URL = 'https://nutri-facil-backend.onrender.com';

const OnboardingStep1 = (  ) => {
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
        try {
            const response = await fetch(`${API_URL}/api/onboarding-step1`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
                const errorData = await response.json();
                toast.error(errorData.msg || 'Falha ao enviar dados. Tente novamente.');
            }
        } catch (error) {
            toast.error('Não foi possível conectar ao servidor.');
        }
    };

    return (
      <PageLayout>
        <div className="form-container">
            <h2>Sobre você</h2>
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
      </PageLayout>
    );
};

export default OnboardingStep1;
