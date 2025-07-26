from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

# Конфигурация почты
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", "587")),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)


async def send_contact_email(
    data: Dict[str, Any], to_email: EmailStr = "dariachugu_work@inbox.ru"
):
    # Формируем HTML тело письма
    html_content = f"""
    <h2>Новая заявка с сайта</h2>
    <p><strong>Имя:</strong> {data['full_name']}</p>
    <p><strong>Город:</strong> {data['city']}</p>
    <p><strong>Телефон:</strong> {data['phone']}</p>
    <p><strong>Email:</strong> {data['email']}</p>
    <p><strong>Компания:</strong> {data.get('company', 'Не указана')}</p>
    <p><strong>Направление:</strong> {data['direction']}</p>
    <p><strong>Описание задачи:</strong></p>
    <p>{data['description']}</p>
    """

    # Создаем объект сообщения
    message = MessageSchema(
        subject="Новая заявка с сайта GeoAnalitica",
        recipients=[to_email],
        body=html_content,
        subtype="html",
    )

    # Инициализируем FastMail
    fm = FastMail(conf)

    # Отправляем письмо
    await fm.send_message(message)
    return True
