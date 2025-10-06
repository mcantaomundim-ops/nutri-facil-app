// src/components/EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PageLayout from './PageLayout';

// ===== APONTANDO PARA A API EM PRODUÇÃO (RENDER) =====
const API_URL = 'https://nutri-facil-backend.onrender.com';

const EditProfile = (  ) => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        weight: '',
        height: '',
        gender: 'male',
        activity_level: 'sedentary'
    });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${API_URL}/api/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Falha ao buscar dados do perfil.');
                }
                const data = await response.json();
                setFormData({
                    name: data.name || '',
                    age: data.age || '',
                    weight: data.weight || '',
                    height: data.height || '',
                    gender: data.gender || 'male',
                    activity_level: data.activity_level || 'sedentary'
                });
            } catch (error) {
                toast.error(error.message);
                navigate('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfileData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    ...formData,
                    age: parseInt(formData.age),
                    weight: parseFloat(formData.weight),
                    height: parseInt(formData.height)
                }),
            });
            if (response.ok) {
                toast.success('Perfil atualizado com sucesso!');
                navigate('/dashboard');
            } else {
                throw new Error('Falha ao atualizar o perfil.');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (isLoading) {
        return (
            <PageLayout>
                <div className="form-container"><h2>Carregando seu perfil...</h2></div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="form-container">
                <h2>Editar seus Dados</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome" required />
                    <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Idade" required />
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Peso (kg)" required />
                    <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Altura (cm)" required />
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="male">Masculino</option>
                        <option value="female">Feminino</option>
                    </select>
                    <select name="activity_level" value={formData.activity_level} onChange={handleChange}>
                        <option value="sedentary">Sedentário</option>
                        <option value="light">Leve</option>
                        <option value="moderate">Moderado</option>
                        <option value="active">Ativo</option>
                        <option value="very_active">Muito Ativo</option>
                    </select>
                    <button type="submit">Salvar Alterações</button>
                </form>
                <Link to="/dashboard" className="back-link">Cancelar</Link>
            </div>
        </PageLayout>
    );
};

export default EditProfile;
