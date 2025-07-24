from sqlalchemy import Boolean, Column, Integer, String, JSON
from app.db.base import TimestampedBase


class User(TimestampedBase):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)

    # 2FA fields
    totp_secret = Column(String, nullable=True)  # Секретный ключ для TOTP
    totp_enabled = Column(Boolean, default=False)  # Включен ли 2FA
    backup_codes = Column(JSON, nullable=True)  # Хеши резервных кодов
