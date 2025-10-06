# Nutri Fácil 🥗

**Nutri Fácil** é uma aplicação web completa projetada para ajudar usuários a atingirem seus objetivos de saúde e fitness através de um planejamento de dieta inteligente e personalizado.

A aplicação calcula as necessidades calóricas e de macronutrientes diárias com base no perfil do usuário e gera um plano de refeições detalhado, dividindo os totais entre refeições sólidas e suplementos de whey protein, conforme a preferência do usuário.

**Acesse a aplicação ao vivo:** **[https://nutri-facil-app.vercel.app/](https://nutri-facil-app.vercel.app/ )**

---

## ✨ Funcionalidades Principais

*   **👤 Autenticação de Usuários:** Sistema seguro de registro e login com JWT (JSON Web Tokens).
*   **📊 Perfil Detalhado:** Coleta de dados essenciais do usuário (idade, peso, altura, nível de atividade) através de um processo de onboarding intuitivo.
*   **🧠 Motor de Cálculo Inteligente:**
    *   Cálculo da Taxa Metabólica Basal (TMB) usando a fórmula de Mifflin-St Jeor.
    *   Ajuste de calorias diárias com base no nível de atividade.
    *   Distribuição de macronutrientes (proteínas, carboidratos, gorduras) com base no peso corporal.
*   **🍽️ Geração de Plano de Refeições:**
    *   Cria um plano de refeições diário com base nas preferências do usuário (número total de refeições, número de refeições com whey).
    *   Divide os macronutrientes de forma equilibrada entre as refeições sólidas e de suplemento.
*   **📈 Dashboard Interativo:** Visualização clara e objetiva do resumo diário de calorias, macros, água e o plano de refeições completo.
*   **✏️ Edição de Perfil:** Permite que os usuários atualizem suas informações pessoais e de dieta a qualquer momento.
*   **📱 Design Responsivo:** Interface limpa e funcional que se adapta a desktops e dispositivos móveis.

---

## 🛠️ Tecnologias Utilizadas

Este projeto é um monorepo dividido em duas partes principais:

### **Frontend (construído com React)**
*   **Framework:** [React](https://reactjs.org/ ) (com [Vite](https://vitejs.dev/ ))
*   **Roteamento:** [React Router DOM](https://reactrouter.com/ )
*   **Estilização:** CSS puro
*   **Notificações:** [React Hot Toast](https://react-hot-toast.com/ )
*   **Hospedagem:** [Vercel](https://vercel.com/ )

### **Backend (construído com Flask)**
*   **Framework:** [Flask](https://flask.palletsprojects.com/ )
*   **Banco de Dados:** [SQLAlchemy](https://www.sqlalchemy.org/ ) (com SQLite)
*   **Autenticação:** [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/ )
*   **Segurança:** [Flask-Bcrypt](https://flask-bcrypt.readthedocs.io/ ) (para hashing de senhas)
*   **Servidor WSGI:** [Gunicorn](https://gunicorn.org/ )
*   **Hospedagem:** [Render](https://render.com/ )

---

## 🚀 Como Rodar o Projeto Localmente

Para executar este projeto em seu ambiente de desenvolvimento, siga os passos abaixo.

### **Pré-requisitos**
*   [Node.js](https://nodejs.org/ ) (versão 16 ou superior)
*   [Python](https://www.python.org/ ) (versão 3.9 ou superior)

### **Instalação**

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/mcantaomundim-ops/nutri-facil-app.git
    cd nutri-facil-app
    ```

2.  **Configure e execute o Backend:**
    ```bash
    # Navegue até a pasta do backend
    cd backend

    # Crie um ambiente virtual e ative-o
    python -m venv venv
    # No Windows:
    .\venv\Scripts\activate
    # No macOS/Linux:
    # source venv/bin/activate

    # Instale as dependências
    pip install -r requirements.txt

    # Inicie o servidor
    flask run
    ```
    O backend estará rodando em `http://127.0.0.1:5000`.

3.  **Configure e execute o Frontend (em um novo terminal ):**
    ```bash
    # Navegue até a pasta do frontend
    cd frontend

    # Instale as dependências
    npm install

    # Inicie o servidor de desenvolvimento
    npm run dev
    ```
    O frontend estará acessível em `http://localhost:5173`.

---

Projeto desenvolvido com a colaboração da IA Manus.
