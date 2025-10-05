# server.py - VERSÃO COM A CORREÇÃO FINAL DA COMUNIDADE
import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import timedelta 
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager

# --- CONFIGURAÇÕES INICIAIS ---
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
bcrypt = Bcrypt(app)

# --- Configuração do JWT ---
app.config["JWT_SECRET_KEY"] = "sua-chave-secreta-super-segura"
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

# --- ROTAS DA API (COM O PREFIXO /api) ---

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
        # ==================================================================
        # A CORREÇÃO ESTÁ AQUI! Transformamos o ID em string.
        access_token = create_access_token(identity=str(user.id))
        # ==================================================================
        return jsonify(token=access_token), 200
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

# --- ABORDAGEM "INFALÍVEL" PARA CRIAR O BANCO DE DADOS ---
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
