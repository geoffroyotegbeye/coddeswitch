# CodeSwitch Backend API

Backend FastAPI avec MongoDB pour la plateforme d'apprentissage CodeSwitch.

## 🚀 Installation et Configuration

### 1. Prérequis
```bash
# Python 3.8+
python --version

# MongoDB (local ou cloud)
# Option 1: MongoDB local
brew install mongodb/brew/mongodb-community  # macOS
# ou
sudo apt install mongodb  # Ubuntu

# Option 2: MongoDB Atlas (cloud) - recommandé
# Créer un compte sur https://cloud.mongodb.com
```

### 2. Installation des dépendances
```bash
cd backend
pip install -r requirements.txt
```

### 3. Configuration
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env avec tes paramètres
nano .env
```

### 4. Démarrage
```bash
# Démarrage du serveur de développement
python run.py

# Ou avec uvicorn directement
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 API Documentation

Une fois le serveur démarré, accède à :
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🏗️ Architecture

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Point d'entrée FastAPI
│   ├── core/
│   │   ├── config.py          # Configuration
│   │   ├── database.py        # Connexion MongoDB
│   │   └── security.py        # JWT & sécurité
│   ├── models/
│   │   ├── user.py            # Modèles utilisateur
│   │   ├── project.py         # Modèles projet
│   │   ├── progress.py        # Modèles progression
│   │   └── auth.py            # Modèles auth
│   ├── api/
│   │   └── v1/
│   │       ├── api.py         # Router principal
│   │       └── endpoints/
│   │           ├── auth.py    # Routes auth
│   │           ├── users.py   # Routes utilisateurs
│   │           ├── projects.py # Routes projets
│   │           └── progress.py # Routes progression
│   └── services/
│       ├── user_service.py    # Logique utilisateur
│       ├── project_service.py # Logique projet
│       └── progress_service.py # Logique progression
├── requirements.txt
├── .env.example
├── run.py
└── README.md
```

## 🔌 Intégration Frontend

### Configuration CORS
Le backend est configuré pour accepter les requêtes du frontend React :
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)

### Endpoints principaux
```
POST /api/v1/auth/register     # Inscription
POST /api/v1/auth/login        # Connexion
POST /api/v1/auth/guest        # Accès invité

GET  /api/v1/users/me          # Profil utilisateur
PUT  /api/v1/users/me          # Mise à jour profil

GET  /api/v1/projects          # Liste des projets
GET  /api/v1/projects/{id}     # Détail projet
POST /api/v1/projects          # Créer projet

GET  /api/v1/progress/{project_id}  # Progression projet
PUT  /api/v1/progress/{project_id}  # Sauvegarder progression
```

## 🔧 Développement

### Tests
```bash
# Installation des dépendances de test
pip install pytest pytest-asyncio httpx

# Lancement des tests
pytest
```

### Base de données
```bash
# Connexion MongoDB locale
mongodb://localhost:27017

# Collections créées automatiquement :
- users              # Utilisateurs
- projects           # Projets
- user_progress      # Progression utilisateurs
- user_badges        # Badges utilisateurs
```