from typing import List, Literal, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from dotenv import load_dotenv
import os

# Загружаем .env файл
load_dotenv()


class Settings(BaseSettings):
    # API settings
    API_V1_STR: str = "/api/v1"
    VERSION: str = "1.0.0"

    # Database settings
    MYSQL_USER: str = "root"  # Значение по умолчанию для разработки
    MYSQL_PASSWORD: str = "root"  # Значение по умолчанию для разработки
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_DATABASE: str = "geoanalitica"

    # Application settings
    APP_ENV: Literal["development", "production", "test"] = "development"
    PROJECT_NAME: str = "GeoAnalitica API"
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3006",
        "http://localhost:5173",
    ]

    # JWT settings
    SECRET_KEY: str = "dev_secret_key_123"  # Временный ключ для разработки
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15

    # Email settings
    MAIL_USERNAME: Optional[str] = None
    MAIL_PASSWORD: Optional[str] = None
    MAIL_FROM: Optional[str] = None
    MAIL_PORT: int = 587
    MAIL_SERVER: Optional[str] = None
    MAIL_FROM_NAME: Optional[str] = None
    MAIL_SSL_TLS: bool = False
    VALIDATE_CERTS: bool = True

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        """Get async database URL."""
        return f"mysql+aiomysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"

    def get_cors_origins(self) -> List[str]:
        """Get list of allowed CORS origins"""
        return self.BACKEND_CORS_ORIGINS

    # Используем новый формат конфигурации для Pydantic v2
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="allow",  # Разрешаем дополнительные поля из .env
    )


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Using lru_cache to avoid reading .env file on every call
    """
    return Settings()


# Создаем экземпляр настроек
settings = get_settings()
