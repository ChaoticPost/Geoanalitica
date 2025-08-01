from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
import os
from core.config import settings

# Исправляем путь импорта
from api.v1.endpoints import users, geo_data, analysis, contact

app = FastAPI(
    title="GeoAnalitica API",
    description="API для геоаналитики и поиска локаций",
    version="1.0.0",
    docs_url=None,  # Отключаем стандартный путь для Swagger
    redoc_url=None,  # Отключаем стандартный путь для ReDoc
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",  # В продакшене заменить на конкретные домены
        "https://*.ngrok-free.app",
        "https://*.ngrok.io",
        "https://*.loca.lt",
        "http://localhost:3006",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры напрямую
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(geo_data.router, prefix="/api/v1/geo", tags=["geo"])
app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["analysis"])
app.include_router(contact.router, prefix="/api/v1/contact", tags=["contact"])


# Кастомный OpenAPI
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


# Кастомный путь для Swagger UI
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
    )


@app.get("/")
async def root():
    return {"message": "GeoAnalitica API is running"}
