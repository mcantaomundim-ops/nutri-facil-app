// src/components/MealOptionsModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// ===== CORREÇÃO =====
// A URL da API foi atualizada para corresponder ao endereço que o backend espera,
// conforme configurado no CORS do arquivo server.py.
// Usaremos o endereço da Vercel, que é onde seu backend provavelmente está publicado
// ou será publicado. Se você estiver rodando o backend localmente,
// poderia usar 'http://127.0.0.1:5000' aqui durante o teste.
const API_URL = 'https://nutri-facil-app.vercel.app';

// O componente recebe 3 "props":
// 1. isOpen: um booleano que diz se o modal deve estar visível
// 2. onClose: uma função para fechar o modal, que será chamada pelo botão "Fechar"
// 3. meal: o objeto da refeição clicada, contendo os macros
const MealOptionsModal = ({ isOpen, onClose, meal }  ) => {
    const [mealOptions, setMealOptions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Esta função só será executada se o modal estiver aberto (isOpen)
        if (!isOpen || !meal) {
            return;
        }

        const fetchMealOptions = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${API_URL}/api/meal-options`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    // Enviamos os macros da refeição selecionada para o backend
                    body: JSON.stringify({
                        protein: meal.protein,
                        carbs: meal.carbs,
                        fat: meal.fat,
                    }),
                });

                if (!response.ok) {
                    // Se a resposta não for OK, tentamos ler a mensagem de erro do backend
                    const errorData = await response.json().catch(() => null);
                    const errorMessage = errorData?.msg || 'Falha ao buscar opções de refeição.';
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                setMealOptions(data);

            } catch (error) {
                toast.error(error.message);
                onClose(); // Fecha o modal em caso de erro
            } finally {
                setIsLoading(false);
            }
        };

        fetchMealOptions();
    }, [isOpen, meal, onClose]); // O useEffect depende dessas variáveis

    // Se o modal não estiver aberto, não renderiza nada
    if (!isOpen) {
        return null;
    }

    return (
        // O "overlay" é o fundo escuro que cobre a tela inteira
        <div className="modal-overlay" onClick={onClose}>
            {/* O "modal-content" é a caixa branca no centro. O e.stopPropagation() impede que o clique dentro da caixa feche o modal. */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Opções para a Refeição {meal.meal_number}</h3>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    {isLoading ? (
                        <p>Calculando opções...</p>
                    ) : (
                        <div className="options-grid">
                            {/* Coluna de Proteínas */}
                            <div className="options-column">
                                <h4>Proteínas ({meal.protein}g)</h4>
                                <ul>
                                    {mealOptions?.protein_options.map(option => (
                                        <li key={option.name}>
                                            {option.name}: <strong>{option.amount}g</strong>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Coluna de Carboidratos */}
                            <div className="options-column">
                                <h4>Carboidratos ({meal.carbs}g)</h4>
                                <ul>
                                    {mealOptions?.carb_options.map(option => (
                                        <li key={option.name}>
                                            {option.name}: <strong>{option.amount}g</strong>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Coluna de Gorduras */}
                            <div className="options-column">
                                <h4>Gorduras ({meal.fat}g)</h4>
                                <ul>
                                    {mealOptions?.fat_options.map(option => (
                                        <li key={option.name}>
                                            {option.name}: <strong>{option.amount}g</strong>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MealOptionsModal;
