// OnboardingStep2.jsx - VERSÃO COM A CORREÇÃO DO BUG
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingStep2 = () => {
    const [mealsPerDay, setMealsPerDay] = useState('4');
    const [wheyMeals, setWheyMeals] = useState('1');
    const [wheyProteinGrams, setWheyProteinGrams] = useState('30');
    const [wheyCarbsGrams, setWheyCarbsGrams] = useState('5');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const response = await fetch('/api/onboarding-step2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            // ==================================================================
            // A CORREÇÃO QUE FALTAVA: Convertendo strings para números
            // ==================================================================
            body: JSON.stringify({
                meals_per_day: parseInt(mealsPerDay),
                whey_meals: parseInt(wheyMeals),
                whey_protein_grams: parseFloat(wheyProteinGrams),
                whey_carbs_grams: parseFloat(wheyCarbsGrams),
            }),
        });

        if (response.ok) {
            navigate('/dashboard'); // Rumo à vitória!
        } else {
            alert('Falha ao enviar dados do Passo 2.');
        }
    };

    return (
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
    );
};

export default OnboardingStep2;
