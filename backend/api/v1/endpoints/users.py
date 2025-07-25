from typing import Any, List
from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.core import security
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import User, UserCreate, UserUpdate, Token

router = APIRouter()


@router.post("/login", response_model=Token)
async def login(
    db: AsyncSession = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """OAuth2 compatible token login"""
    user = await db.query(User).filter(User.email == form_data.username).first()
    if not user or not security.verify_password(
        form_data.password, user.hashed_password
    ):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token = security.create_access_token(user.id)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=User)
async def create_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserCreate,
) -> Any:
    """Create new user"""
    user = await db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system",
        )

    user = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        is_superuser=False,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.get("/me", response_model=User)
async def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Get current user"""
    return current_user


@router.put("/me", response_model=User)
async def update_user_me(
    *,
    db: AsyncSession = Depends(get_db),
    password: str = Body(None),
    full_name: str = Body(None),
    email: str = Body(None),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Update own user"""
    current_user_data = UserUpdate(
        password=password or current_user.hashed_password,
        full_name=full_name or current_user.full_name,
        email=email or current_user.email,
    )

    for field, value in current_user_data.dict(exclude_unset=True).items():
        if field == "password":
            setattr(current_user, "hashed_password", security.get_password_hash(value))
        else:
            setattr(current_user, field, value)

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user
