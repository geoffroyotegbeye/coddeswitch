from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, projects, progress, blog, community, messages, admin

api_router = APIRouter()

# Routes d'authentification
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Routes utilisateurs
api_router.include_router(users.router, prefix="/users", tags=["Users"])

# Routes projets
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])

# Routes progression
api_router.include_router(progress.router, prefix="/progress", tags=["Progress"])

# Routes blog
api_router.include_router(blog.router, prefix="/blog", tags=["Blog"])

# Routes communauté
api_router.include_router(community.router, prefix="/community", tags=["Community"])

# Routes messages
api_router.include_router(messages.router, prefix="/messages", tags=["Messages"])

# Routes administration
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])