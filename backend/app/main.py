from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.core.config import settings
from app.api.v1.api import api_router
from app.core.database import connect_to_mongo, close_mongo_connection

app = FastAPI(
    title="CodeSwitch API",
    description="API Backend pour la plateforme d'apprentissage CodeSwitch",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL du frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes API
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    """Connexion à MongoDB au démarrage"""
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    """Fermeture de la connexion MongoDB"""
    await close_mongo_connection()

@app.get("/")
async def root():
    return {"message": "CodeSwitch API v1.0.0", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )