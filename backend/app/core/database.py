from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    database = None

db = Database()

async def get_database():
    return db.database

async def connect_to_mongo():
    """Connexion à MongoDB"""
    try:
        db.client = AsyncIOMotorClient(settings.MONGODB_URL)
        db.database = db.client[settings.DATABASE_NAME]
        
        # Test de connexion
        await db.client.admin.command('ping')
        logger.info("✅ Connexion à MongoDB réussie")
        
        # Création des index
        await create_indexes()
        
    except ConnectionFailure as e:
        logger.error(f"❌ Erreur de connexion à MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Fermeture de la connexion MongoDB"""
    if db.client:
        db.client.close()
        logger.info("🔌 Connexion MongoDB fermée")

async def create_indexes():
    """Création des index pour optimiser les performances"""
    try:
        # Index pour les utilisateurs
        await db.database.users.create_index("email", unique=True)
        await db.database.users.create_index("username", unique=True)
        
        # Index pour les projets
        await db.database.projects.create_index("language")
        await db.database.projects.create_index("difficulty")
        await db.database.projects.create_index("type")
        
        # Index pour les progressions
        await db.database.user_progress.create_index([("user_id", 1), ("project_id", 1)], unique=True)
        
        # Index pour les badges
        await db.database.user_badges.create_index("user_id")
        
        logger.info("📊 Index MongoDB créés avec succès")
        
    except Exception as e:
        logger.error(f"❌ Erreur lors de la création des index: {e}")