from pydantic import BaseModel, EmailStr


class ContactCreate(BaseModel):
    full_name: str
    city: str
    phone: str
    email: EmailStr
    company: str | None = None
    direction: str
    description: str
