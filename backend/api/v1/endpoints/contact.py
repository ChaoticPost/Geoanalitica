from fastapi import APIRouter, HTTPException
from app.schemas.contact import ContactRequest
from app.services.email import email_service
import logging
from pydantic import ValidationError, EmailStr

# Настраиваем логирование
logger = logging.getLogger(__name__)

router = APIRouter(tags=["contact"])


@router.post("/submit", status_code=200)
async def submit_contact_form(contact: ContactRequest):
    """
    Обрабатывает отправку контактной формы
    """
    try:
        # Логируем входящие данные
        logger.info("Получены данные формы:")
        logger.info(f"ФИО: {contact.full_name}")
        logger.info(f"Город: {contact.city}")
        logger.info(f"Телефон: {contact.phone}")
        logger.info(f"Email: {contact.email}")
        logger.info(f"Компания: {contact.company}")
        logger.info(f"Направление: {contact.direction}")
        logger.info(f"Описание: {contact.description}")

        # Отправляем подтверждение на email пользователя
        success = await email_service.send_contact_confirmation(
            email=contact.email, name=contact.full_name
        )

        if not success:
            logger.error(f"Ошибка отправки email для заявки от {contact.full_name}")
            raise HTTPException(
                status_code=500,
                detail="Не удалось отправить сообщение. Пожалуйста, попробуйте позже.",
            )

        logger.info(f"Заявка от {contact.full_name} успешно обработана")
        return {
            "status": "success",
            "message": "Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
        }

    except ValidationError as e:
        logger.error(f"Ошибка валидации данных: {str(e)}")
        raise HTTPException(status_code=422, detail={"errors": e.errors()})

    except Exception as e:
        logger.error(f"Необработанная ошибка при обработке заявки: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Произошла внутренняя ошибка сервера. Пожалуйста, попробуйте позже.",
        )


@router.post("/test-email", status_code=200)
async def test_email(email: EmailStr):
    """
    Тестовый эндпоинт для проверки отправки email
    Доступен только в режиме разработки
    """
    try:
        success = await email_service.send_email(
            email=email,
            subject="Тестовое письмо от GeoAnalitica",
            body="""
            <h2>Это тестовое письмо</h2>
            <p>Если вы получили это письмо, значит настройки SMTP-сервера работают корректно.</p>
            <br>
            <p>С уважением,<br>Команда GeoAnalitica</p>
            """,
        )

        if not success:
            raise HTTPException(
                status_code=500,
                detail="Не удалось отправить тестовое письмо. Проверьте настройки SMTP.",
            )

        return {
            "status": "success",
            "message": f"Тестовое письмо успешно отправлено на {email}",
        }

    except Exception as e:
        logger.error(f"Ошибка при отправке тестового письма: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при отправке письма: {str(e)}",
        )
