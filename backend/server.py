# server.py - VERSÃO COM LÓGICA DE CÁLCULO INTELIGENTE
import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import timedelta 
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager

# --- CONFIGURAÇÕES INICIAIS ---
app = Flask(__name__)
# ===== ALTERAÇÃO CRÍTICA: Permitindo acesso de qualquer origem para testes =====
CORS(app)
bcrypt = Bcrypt(app)

# --- Configuração do JWT ---
app.config["JWT_SECRET_KEY"] = "sua-chave-secreta-super-segura"
# ... (resto da configuração do JWT)
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
jwt = JWTManager(app)


# --- CONFIGURAÇÃO DO BANCO DE DADOS ---
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- MODELO DO BANCO DE DADOS ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False) 
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(120))
    gender = db.Column(db.String(50))
    age = db.Column(db.Integer)
    height = db.Column(db.Integer)
    weight = db.Column(db.Float)
    activity_level = db.Column(db.String(50))
    meals_per_day = db.Column(db.Integer, default=0)
    whey_meals = db.Column(db.Integer, default=0)
    whey_protein_grams = db.Column(db.Float, default=0) 
    whey_carbs_grams = db.Column(db.Float, default=0)
    def __repr__(self):
        return f'<User {self.email}>'

# ==================================================================
# --- LÓGICA DE CÁLCULO 2.0 ---
# ==================================================================

def calculate_total_metrics(user):
    """Calcula apenas os totais diários de macros e calorias."""
    if not all([user.weight, user.height, user.age, user.gender, user.activity_level]):
        return None
        
    activity_factors = {"sedentary": 1.2, "light": 1.375, "moderate": 1.55, "active": 1.725, "very_active": 1.9}
    if user.gender == 'male':
        bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) + 5
    else:
        bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) - 161
    
    activity_factor = activity_factors.get(user.activity_level, 1.2)
    total_calories = bmr * activity_factor
    
    # Usando uma distribuição mais comum: 2g/kg de proteína, 1g/kg de gordura, resto de carbo
    protein_grams = user.weight * 2
    fat_grams = user.weight * 1
    
    protein_calories = protein_grams * 4
    fat_calories = fat_grams * 9
    
    carbs_calories = total_calories - protein_calories - fat_calories
    carbs_grams = carbs_calories / 4
    
    water_liters = (user.weight * 35) / 1000
    
    return {
        "total_calories": round(total_calories), 
        "protein_grams": round(protein_grams), 
        "carbs_grams": round(carbs_grams), 
        "fat_grams": round(fat_grams),
        "water_liters": round(water_liters, 1)
    }

def calculate_meal_plan(user, total_metrics):
    """Calcula o plano de refeições com base nos totais e nas preferências do usuário."""
    num_whey_meals = user.whey_meals or 0
    num_solid_meals = (user.meals_per_day or 0) - num_whey_meals

    if num_solid_meals < 0 or user.meals_per_day == 0:
        return [] # Retorna vazio se a configuração for inválida

    # 1. Calcula o total de macros vindos do Whey
    total_whey_protein = num_whey_meals * (user.whey_protein_grams or 0)
    total_whey_carbs = num_whey_meals * (user.whey_carbs_grams or 0)
    total_whey_fat = 0 # Assumindo 0g de gordura no whey para simplificar
    total_whey_calories = (total_whey_protein * 4) + (total_whey_carbs * 4)

    # 2. Calcula os macros restantes para as refeições sólidas
    remaining_protein = total_metrics['protein_grams'] - total_whey_protein
    remaining_carbs = total_metrics['carbs_grams'] - total_whey_carbs
    remaining_fat = total_metrics['fat_grams'] - total_whey_fat
    remaining_calories = total_metrics['total_calories'] - total_whey_calories

    # 3. Calcula os macros por refeição sólida
    protein_per_solid_meal = remaining_protein / num_solid_meals if num_solid_meals > 0 else 0
    carbs_per_solid_meal = remaining_carbs / num_solid_meals if num_solid_meals > 0 else 0
    fat_per_solid_meal = remaining_fat / num_solid_meals if num_solid_meals > 0 else 0
    calories_per_solid_meal = remaining_calories / num_solid_meals if num_solid_meals > 0 else 0

    # 4. Monta o plano final
    meal_plan = []
    whey_meals_added = 0
    for i in range(1, user.meals_per_day + 1):
        if whey_meals_added < num_whey_meals:
            # Adiciona uma refeição de Whey
            meal_plan.append({
                'meal_number': i,
                'type': 'Whey',
                'calories': round((user.whey_protein_grams * 4) + (user.whey_carbs_grams * 4)),
                'protein': round(user.whey_protein_grams),
                'carbs': round(user.whey_carbs_grams),
                'fat': 0
            })
            whey_meals_added += 1
        else:
            # Adiciona uma refeição sólida
            meal_plan.append({
                'meal_number': i,
                'type': 'Sólida',
                'calories': round(calories_per_solid_meal),
                'protein': round(protein_per_solid_meal),
                'carbs': round(carbs_per_solid_meal),
                'fat': round(fat_per_solid_meal)
            })
            
    return meal_plan

# --- ROTAS DA API ---

# ... (Rotas de register, login, onboarding, profile permanecem as mesmas) ...
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"msg": "Email e senha são obrigatórios!"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Este email já está cadastrado!"}), 400
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "Usuário cadastrado com sucesso!"}), 201

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=str(user.id))
        is_onboarding_complete = user.name is not None and user.name != ''
        return jsonify(token=access_token, is_onboarding_complete=is_onboarding_complete), 200
    return jsonify({"msg": "Email ou senha inválidos."}), 401

@app.route('/api/onboarding-step1', methods=['POST'])
@jwt_required()
def onboarding_step1():
    user_id = get_jwt_identity()
    user = db.get_or_404(User, user_id)
    data = request.get_json()
    user.name = data.get('name')
    user.gender = data.get('gender')
    user.age = data.get('age')
    user.height = data.get('height')
    user.weight = data.get('weight')
    user.activity_level = data.get('activity_level')
    db.session.commit()
    return jsonify({"msg": "Passo 1 do onboarding completo!"}), 200

@app.route('/api/onboarding-step2', methods=['POST'])
@jwt_required()
def onboarding_step2():
    user_id = get_jwt_identity()
    user = db.get_or_404(User, user_id)
    data = request.get_json()
    user.meals_per_day = data.get('meals_per_day')
    user.whey_meals = data.get('whey_meals')
    user.whey_protein_grams = data.get('whey_protein_grams')
    user.whey_carbs_grams = data.get('whey_carbs_grams')
    db.session.commit()
    return jsonify({"msg": "Informações da dieta atualizadas com sucesso!"}), 200

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = db.get_or_404(User, user_id)
    
    return jsonify({
        'name': user.name,
        'gender': user.gender,
        'age': user.age,
        'height': user.height,
        'weight': user.weight,
        'activity_level': user.activity_level,
        'meals_per_day': user.meals_per_day,
        'whey_meals': user.whey_meals,
        'whey_protein_grams': user.whey_protein_grams,
        'whey_carbs_grams': user.whey_carbs_grams
    })

@app.route('/api/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = db.get_or_404(User, user_id)
    data = request.get_json()
    
    user.name = data.get('name', user.name)
    user.gender = data.get('gender', user.gender)
    user.age = data.get('age', user.age)
    user.height = data.get('height', user.height)
    user.weight = data.get('weight', user.weight)
    user.activity_level = data.get('activity_level', user.activity_level)
    user.meals_per_day = data.get('meals_per_day', user.meals_per_day)
    user.whey_meals = data.get('whey_meals', user.whey_meals)
    user.whey_protein_grams = data.get('whey_protein_grams', user.whey_protein_grams)
    user.whey_carbs_grams = data.get('whey_carbs_grams', user.whey_carbs_grams)
    
    db.session.commit()
    
    return jsonify({'msg': 'Perfil atualizado com sucesso!'})


# ==================================================================
# --- ROTA DO DASHBOARD 2.0 ---
# ==================================================================
@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    user_id = get_jwt_identity()
    user = db.get_or_404(User, user_id)
    
    if not all([user.weight, user.height, user.age, user.gender, user.activity_level, user.meals_per_day]):
        return jsonify({"msg": "Dados de perfil incompletos para calcular o plano."}), 400
    
    # 1. Calcula os totais diários
    total_metrics = calculate_total_metrics(user)
    
    # 2. Calcula o plano de refeições detalhado
    meal_plan = calculate_meal_plan(user, total_metrics)
    
    # 3. Retorna tudo para o frontend de uma vez
    return jsonify({
        "name": user.name, 
        "metrics": total_metrics,
        "meal_plan": meal_plan
    }), 200

# A ROTA /api/meal-plan FOI REMOVIDA POIS NÃO É MAIS NECESSÁRIA

# --- INICIALIZAÇÃO ---
with app.app_context():
    db.create_all()
