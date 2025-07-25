from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import List, Optional
from app.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME or "test@example.com",
    MAIL_PASSWORD=settings.MAIL_PASSWORD or "test_password",
    MAIL_FROM=settings.MAIL_FROM or "test@example.com",
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER or "smtp.example.com",
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME or "GeoAnalitica",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=settings.VALIDATE_CERTS,
)


class EmailService:
    def __init__(self):
        self.fastmail = FastMail(conf)

    async def send_email(
        self,
        email: EmailStr,
        subject: str,
        body: str,
        template_name: Optional[str] = None,
        template_body: Optional[dict] = None,
    ) -> bool:
        """
        Отправляет email используя настроенный SMTP сервер

        Args:
            email: Email получателя
            subject: Тема письма
            body: Текст письма
            template_name: Имя шаблона (опционально)
            template_body: Данные для шаблона (опционально)

        Returns:
            bool: True если отправка успешна, False если произошла ошибка
        """
        try:
            message = MessageSchema(
                subject=subject, recipients=[email], body=body, subtype="html"
            )

            await self.fastmail.send_message(message)
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False

    async def send_welcome_email(self, email: EmailStr, username: str) -> bool:
        """
        Отправляет приветственное письмо новому пользователю
        """
        subject = "Добро пожаловать в GeoAnalitica!"
        body = f"""
        <h2>Здравствуйте, {username}!</h2>
        <p>Добро пожаловать в GeoAnalitica. Мы рады, что вы с нами!</p>
        <p>Теперь вы можете использовать все возможности нашей платформы для анализа геоданных.</p>
        <br>
        <p>С уважением,<br>Команда GeoAnalitica</p>
        """
        return await self.send_email(email, subject, body)

    async def send_contact_confirmation(self, email: EmailStr, name: str) -> bool:
        """
        Отправляет подтверждение получения контактной формы
        """
        subject = "Ваша заявка получена - GeoAnalitica"
        body = f"""
        <h2>Здравствуйте, {name}!</h2>
        <p>Спасибо за ваше обращение в GeoAnalitica.</p>
        <p>Мы получили вашу заявку и свяжемся с вами в ближайшее время.</p>
        <br>
        <p>С уважением,<br>Команда GeoAnalitica</p>
        """
        return await self.send_email(email, subject, body)


email_service = EmailService()
