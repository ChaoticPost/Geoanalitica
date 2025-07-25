import pyotp
from typing import Tuple
from app.core.config import settings
from app.core.security import get_password_hash


class TOTPService:
    """
    Сервис для работы с Time-based One-Time Password (TOTP)
    Используется для двухфакторной аутентификации
    """

    def __init__(self):
        self.issuer_name = "GeoAnalitica"

    def generate_totp_secret(self) -> str:
        """
        Генерирует секретный ключ для TOTP
        """
        return pyotp.random_base32()

    def get_totp_uri(self, email: str, secret: str) -> str:
        """
        Создает URI для QR-кода

        Args:
            email: Email пользователя
            secret: Секретный ключ TOTP

        Returns:
            str: URI для генерации QR-кода
        """
        totp = pyotp.TOTP(secret)
        return totp.provisioning_uri(name=email, issuer_name=self.issuer_name)

    def verify_totp(self, secret: str, token: str) -> bool:
        """
        Проверяет TOTP токен

        Args:
            secret: Секретный ключ пользователя
            token: TOTP токен для проверки

        Returns:
            bool: True если токен верный, False если нет
        """
        totp = pyotp.TOTP(secret)
        return totp.verify(token)

    def generate_backup_codes(self, count: int = 8) -> Tuple[list[str], list[str]]:
        """
        Генерирует резервные коды для 2FA

        Args:
            count: Количество кодов для генерации

        Returns:
            Tuple[list[str], list[str]]: Список кодов и их хешей
        """
        codes = []
        hashed_codes = []
        for _ in range(count):
            code = pyotp.random_base32()[
                :8
            ]  # 8 символов достаточно для резервного кода
            codes.append(code)
            hashed_codes.append(get_password_hash(code))
        return codes, hashed_codes


totp_service = TOTPService()
