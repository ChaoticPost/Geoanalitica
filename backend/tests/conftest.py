import pytest
from typing import AsyncGenerator, Generator
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.db.base import Base
from app.db.session import get_db
from app.main import app

# Test database URL
SQLALCHEMY_DATABASE_URL = (
    "postgresql+asyncpg://postgres:postgres@localhost:5432/test_geoanalitica"
)

engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True, future=True)
TestingSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture(scope="session")
def event_loop(request) -> Generator:
    """Create an instance of the default event loop for each test case."""
    import asyncio

    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def test_db_setup_sessionmaker():
    # Create the test database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def db(test_db_setup_sessionmaker) -> AsyncGenerator[AsyncSession, None]:
    async with TestingSessionLocal() as session:
        yield session


@pytest.fixture
async def client(db) -> Generator:
    async def _get_test_db():
        try:
            yield db
        finally:
            await db.close()

    app.dependency_overrides[get_db] = _get_test_db
    with TestClient(app) as c:
        yield c
