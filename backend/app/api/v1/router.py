from fastapi import APIRouter
from app.api.v1.endpoints import users, geo_data, analysis

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(geo_data.router, prefix="/geo", tags=["geo"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
