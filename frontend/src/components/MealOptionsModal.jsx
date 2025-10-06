// src/components/MealOptionsModal.jsx - VERSÃO FINAL FUNCIONAL
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// A URL da API aponta para o backend publicado no Render.
const API_URL = 'https://nutri-facil-backend.onrender.com';

const MealOptionsModal = ({ isOpen, onClose, meal } ) => {
    const [mealOptions, setMealOptions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // A função só é executada se o modal estiver aberto e tiver uma refeição.
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
                    // Envia os macros da refeição selecionada para o backend.
                    body: JSON.stringify({
                        protein: meal.protein,
                        carbs: meal.carbs,
                        fat: meal.fat,
                    }),
                });

                if (!response.ok) {
                    // Tenta ler a mensagem de erro do backend para um feedback mais claro.
                    const errorData = await response.json().catch(() => null);
                    const errorMessage = errorData?.msg || 'Falha ao buscar opções de refeição.';
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                setMealOptions(data);

            } catch (error) {
                toast.error(error.message);
                onClose(); // Fecha o modal em caso de erro para não travar a tela.
            } finally {
                setIsLoading(false);
            }
        };

        fetchMealOptions();
    }, [isOpen, meal, onClose]); // O useEffect é re-executado se alguma dessas props mudar.

    // Se o modal não estiver aberto, não renderiza nada.
    if (!isOpen) {
        return null;
    }

    return (
        // O "overlay" é o fundo escuro que cobre a tela inteira.
        <div className="modal-overlay" onClick={onClose}>
            {/* O "modal-content" é a caixa branca. O e.stopPropagation() impede que o clique dentro da caixa feche o modal. */}
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
