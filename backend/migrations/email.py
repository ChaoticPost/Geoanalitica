from aiosmtplib import SMTP
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings
from app.schemas.contact import ContactRequest

RECIPIENT_EMAIL = "dariachugu_work@inbox.ru"  # Фиксированный email для получения заявок


async def send_contact_form_email(contact: ContactRequest) -> bool:
    """
    Отправляет данные контактной формы на указанный email
    """
    # Создаем HTML шаблон письма
    html_content = f"""
    <html>
        <body>
            <h2>Заявка с сайта Geoanalitica</h2>
            <p><strong>Имя и фамилия:</strong> {contact.full_name}</p>
            <p><strong>Город:</strong> {contact.city}</p>
            <p><strong>Телефон:</strong> {contact.phone}</p>
            <p><strong>Email для связи:</strong> {contact.email}</p>
            <p><strong>Компания:</strong> {contact.company or 'Не указана'}</p>
            <p><strong>Направление:</strong> {contact.direction}</p>
            <h3>Описание задачи:</h3>
            <p>{contact.description}</p>
        </body>
    </html>
    """


    # Создаем email сообщение
    message = MIMEMultipart()
    message["From"] = settings.MAIL_FROM  # От кого (наш SMTP аккаунт)
    message["To"] = RECIPIENT_EMAIL  # Кому (фиксированный адрес для заявок)
    message["Subject"] = f"Заявка с сайта Geoanalitica от {contact.full_name}"
    message["Reply-To"] = contact.email  # Email пользователя для ответа

    # Добавляем HTML контент
    message.attach(MIMEText(html_content, "html"))

    try:
        # Инициализируем SMTP клиент
        smtp = SMTP(
            hostname=settings.MAIL_SERVER,
            port=settings.MAIL_PORT,
            use_tls=settings.MAIL_SSL_TLS,
            validate_certs=settings.VALIDATE_CERTS,
        )

        # Отправляем email
        await smtp.connect()
        if settings.MAIL_USERNAME and settings.MAIL_PASSWORD:
            await smtp.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)

        await smtp.send_message(message)
        await smtp.quit()

        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False
