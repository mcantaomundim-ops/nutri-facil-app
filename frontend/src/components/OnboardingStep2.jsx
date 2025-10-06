// src/components/OnboardingStep2.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PageLayout from './PageLayout'; // 1. ADICIONANDO O LAYOUT PADRÃO

const API_URL = 'http://127.0.0.1:5000'; // 2. USANDO A URL COMPLETA

const OnboardingStep2 = ( ) => {
    const [mealsPerDay, setMealsPerDay] = useState('4');
    const [wheyMeals, setWheyMeals] = useState('1');
    const [wheyProteinGrams, setWheyProteinGrams] = useState('30');
    const [wheyCarbsGrams, setWheyCarbsGrams] = useState('5');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_URL}/api/onboarding-step2`, { // URL corrigida
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    meals_per_day: parseInt(mealsPerDay),
                    whey_meals: parseInt(wheyMeals),
                    whey_protein_grams: parseFloat(wheyProteinGrams),
                    whey_carbs_grams: parseFloat(wheyCarbsGrams),
                }),
            });

            if (response.ok) {
                toast.success('Configuração salva! Bem-vindo(a)!'); // 3. USANDO TOAST
                navigate('/dashboard');
            } else {
                throw new Error('Falha ao salvar configuração.');
            }
        } catch (error) {
            toast.error(error.message); // 3. USANDO TOAST
        }
    };

    return (
        // 4. ENVOLVENDO COM O PageLayout
        <PageLayout>
            <div className="form-container">
                <h2>Passo 2: Preferências da Dieta</h2>
                <form onSubmit={handleSubmit}>
                    <label>Quantas refeições você faz por dia?</label>
                    <input type="number" value={mealsPerDay} onChange={(e) => setMealsPerDay(e.target.value)} required />

                    <label>Em quantas delas você pode incluir Whey Protein?</label>
                    <input type="number" value={wheyMeals} onChange={(e) => setWheyMeals(e.target.value)} required />

                    <label>Gramas de Proteína por dose de Whey:</label>
                    <input type="number" value={wheyProteinGrams} onChange={(e) => setWheyProteinGrams(e.target.value)} required />

                    <label>Gramas de Carboidrato por dose de Whey:</label>
                    <input type="number" value={wheyCarbsGrams} onChange={(e) => setWheyCarbsGrams(e.target.value)} required />

                    <button type="submit">Finalizar e Criar Dieta</button>
                </form>
            </div>
        </PageLayout>
    );
};

export default OnboardingStep2;
