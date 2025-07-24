from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from .config import settings

# Создаем асинхронный движок SQLAlchemy
engine = create_async_engine(
    settings.ASYNC_DATABASE_URL,
    echo=False,  # Set to True to see SQL queries
    pool_pre_ping=True,  # Проверка соединения перед использованием
    pool_size=10,  # Максимальное количество соединений в пуле
    max_overflow=20,  # Максимальное количество соединений сверх pool_size
    pool_recycle=3600,  # Пересоздание соединений каждый час
)

# Создаем фабрику сессий
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    """Base class for all database models"""

    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for getting async database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
