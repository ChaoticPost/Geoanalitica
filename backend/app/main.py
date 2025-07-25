from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from fastapi.middleware.trustedhost import TrustedHostMiddleware


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        # HSTS: принудительно HTTPS на 1 год
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains"
        )
        # Защита от XSS
        response.headers["X-XSS-Protection"] = "1; mode=block"
        # Запрет встраивания сайта в iframe (защита от clickjacking)
        response.headers["X-Frame-Options"] = "DENY"
        # Запрет угадывания MIME типов
        response.headers["X-Content-Type-Options"] = "nosniff"
        # CSP (Content Security Policy)
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
        )
        return response


app = FastAPI(
    title="GeoAnalitica API",
    description="API для геоаналитики и поиска локаций",
    version="1.0.0",
)

# Добавляем middleware
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"],  # В продакшене заменить на реальные домены
)

# Существующие CORS настройки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене заменить на список разрешенных доменов
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... rest of your existing code ...
