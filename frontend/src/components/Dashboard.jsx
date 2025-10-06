// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PageLayout from './PageLayout';
// Futuramente, importaremos nosso modal aqui
// import MealOptionsModal from './MealOptionsModal'; 

// ===== APONTANDO PARA A API EM PRODUÇÃO (RENDER) =====
const API_URL = 'https://nutri-facil-backend.onrender.com';

const Dashboard = ({ setToken }   ) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // ===== 1. NOVOS ESTADOS PARA O MODAL =====
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        toast.success('Você saiu com sucesso!');
        navigate('/login');
    };

    // ===== 2. FUNÇÃO PARA ABRIR O MODAL =====
    const handleMealClick = (meal) => {
        // Só abre o modal para refeições sólidas
        if (meal.type === 'Sólida') {
            setSelectedMeal(meal);
            setIsModalOpen(true);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) { 
                navigate('/login'); 
                return; 
            }
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/api/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.status === 401) {
                    handleLogout();
                    return;
                }
                if (!response.ok) { 
                    const errorData = await response.json();
                    if (response.status === 400 && errorData.msg.includes("incompletos")) {
                        toast.error("Seu perfil está incompleto. Por favor, preencha seus dados.");
                        navigate('/edit-profile');
                    } else {
                        throw new Error(errorData.msg || 'Falha ao buscar dados do dashboard.');
                    }
                    return;
                }
                const data = await response.json();
                setDashboardData(data);
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    if (isLoading) {
        return (
            <PageLayout>
                <div className="form-container"><h2>Calculando seu plano...</h2></div>
            </PageLayout>
        );
    }

    if (!dashboardData) {
        return (
            <PageLayout>
                <div className="form-container">
                    <h2>Ops!</h2><p>Não foi possível carregar seus dados. Tente recarregar a página.</p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="form-container dashboard-grid-layout">
                
                {/* --- ÁREA 1: CABEÇALHO --- */}
                <div className="dashboard-header">
                    <h2 className="dashboard-greeting">Olá, {dashboardData.name}!</h2>
                    <div className="dashboard-actions">
                        <Link to="/edit-profile" className="logout-button">Editar Perfil</Link>
                        <a href="#" onClick={handleLogout} className="logout-button">Sair</a>
                    </div>
                </div>

                {/* --- ÁREA 2: RESUMO DIÁRIO --- */}
                <div className="daily-summary-section">
                    <div className="section-header">
                        <h3>Seu Resumo Diário</h3>
                    </div>
                    <div className="metrics-grid">
                        <div className="metric-card large">
                            <div className="metric-value">{dashboardData.metrics.total_calories}</div>
                            <div className="metric-label">Calorias</div>
                        </div>
                        <div className="metric-card large">
                            <div className="metric-value">{dashboardData.metrics.water_liters}L</div>
                            <div className="metric-label">Água</div>
                        </div>
                    </div>
                    <div className="metrics-grid">
                        <div className="metric-card">
                            <div className="metric-value">{dashboardData.metrics.protein_grams}g</div>
                            <div className="metric-label">Proteínas</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-value">{dashboardData.metrics.carbs_grams}g</div>
                            <div className="metric-label">Carboidratos</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-value">{dashboardData.metrics.fat_grams}g</div>
                            <div className="metric-label">Gorduras</div>
                        </div>
                    </div>
                </div>

                {/* --- ÁREA 3: PLANO DE REFEIÇÕES --- */}
                <div className="meal-plan-section">
                    <div className="section-header">
                        <h3>Seu Plano de Refeições</h3>
                        <Link to="/onboarding-step2" className="edit-prefs-button">Editar</Link>
                    </div>
                    <div className="meal-cards-container">
                        {dashboardData.meal_plan && dashboardData.meal_plan.map((meal) => (
                            // ===== 3. ADICIONANDO O EVENTO DE CLIQUE =====
                            <div 
                                key={meal.meal_number} 
                                className={`meal-card ${meal.type === 'Whey' ? 'whey-meal' : 'solid-meal'}`} // Adicionada classe 'solid-meal' para estilização
                                onClick={() => handleMealClick(meal)}
                            >
                                <div className="meal-card-header">
                                    <h4>Refeição {meal.meal_number}</h4>
                                    <span className="meal-type">{meal.type}</span>
                                </div>
                                <div className="meal-card-body">
                                    <div className="meal-macro">
                                        <strong>{meal.calories}</strong>
                                        <span>Kcal</span>
                                    </div>
                                    <div className="meal-macro">
                                        <strong>{meal.protein}g</strong>
                                        <span>Proteína</span>
                                    </div>
                                    <div className="meal-macro">
                                        <strong>{meal.carbs}g</strong>
                                        <span>Carbo</span>
                                    </div>
                                    <div className="meal-macro">
                                        <strong>{meal.fat}g</strong>
                                        <span>Gordura</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== 4. RENDERIZAÇÃO CONDICIONAL DO MODAL (AINDA COMO PLACEHOLDER) ===== */}
            {isModalOpen && selectedMeal && (
                <div>
                    {/* Aqui é onde nosso futuro componente <MealOptionsModal /> será renderizado */}
                    <h1>Modal Aberto para Refeição {selectedMeal.meal_number}</h1>
                    <p>Proteínas: {selectedMeal.protein}g</p>
                    <p>Carboidratos: {selectedMeal.carbs}g</p>
                    <p>Gorduras: {selectedMeal.fat}g</p>
                    <button onClick={() => setIsModalOpen(false)}>Fechar</button>
                </div>
            )}
        </PageLayout>
    );
};

export default Dashboard;
