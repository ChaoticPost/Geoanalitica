from pydantic import BaseModel, EmailStr, constr


class ContactRequest(BaseModel):
    full_name: constr(min_length=2, max_length=100)
    city: constr(min_length=2, max_length=100)
    phone: constr(min_length=10, max_length=20)
    email: EmailStr
    company: str = ""
    direction: str = "Геоаналитика"
    description: constr(min_length=10, max_length=1000)
