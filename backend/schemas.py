from datetime import datetime
from typing import Optional

from pydantic import BaseModel
from models import ReminderStatus


class ReminderCreate(BaseModel):
    title: str
    message: str
    phone: str

    scheduled_at: datetime
    timezone: str

class ReminderUpdate(BaseModel):
    title: Optional[str] = None
    message: Optional[str] = None
    phone: Optional[str] = None

    scheduled_at: Optional[datetime] = None
    timezone: Optional[str] = None

    status: Optional[ReminderStatus] = None
    last_error: Optional[str] = None


class ReminderRead(BaseModel):
    id: str
    title: str
    message: str
    phone: str

    scheduled_at: datetime
    timezone: str
    status: ReminderStatus

    created_at: datetime
    updated_at: datetime
    last_error: Optional[str] = None

    class Config:
        from_attributes = True
