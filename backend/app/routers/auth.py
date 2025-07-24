from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db
from ..core.security import create_access_token
from ..schemas.user import UserCreate, UserLogin, UserResponse, Token
from ..services.user import UserService

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate, db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """Register new user."""
    user_service = UserService(db)

    # Check if user exists
    if await user_service.get_by_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create new user
    user = await user_service.create(
        email=user_data.email,
        password=user_data.password,
        full_name=user_data.full_name,
    )

    return user


@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: AsyncSession = Depends(get_db)) -> Token:
    """Login user."""
    user_service = UserService(db)

    # Authenticate user
    user = await user_service.authenticate(
        email=login_data.email, password=login_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(data={"sub": user.email})

    return Token(access_token=access_token)
