from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal

router = APIRouter()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@router.get("/ping-db")
async def ping_db(db: AsyncSession = Depends(get_db)):
    result = await db.execute("SELECT 1")
    return {"ok": result.scalar() == 1}
