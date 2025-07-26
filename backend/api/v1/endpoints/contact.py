from fastapi import APIRouter, HTTPException
from schemas.contact import ContactCreate
from services.email import send_contact_email

router = APIRouter()


@router.post("/submit")
async def submit_contact_form(contact: ContactCreate):
    try:
        # Отправляем email
        await send_contact_email(contact.dict())
        return {"status": "success", "message": "Заявка успешно отправлена"}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Ошибка при отправке заявки: {str(e)}"
        )
