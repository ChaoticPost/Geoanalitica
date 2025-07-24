from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
static_dir = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static"
)
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/favicon.ico")
async def get_favicon():
    """Serve favicon"""
    favicon_path = os.path.join(static_dir, "favicon.ico")
    if not os.path.exists(favicon_path):
        # Если favicon.ico не существует, используем стандартный
        favicon_path = os.path.join(os.path.dirname(__file__), "static", "favicon.ico")
    return FileResponse(favicon_path)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Geoanalitica API",
        "docs_url": "/docs",
        "version": settings.VERSION,
    }
