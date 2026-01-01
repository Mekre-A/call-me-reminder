from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from uuid import uuid4

from sqlmodel import Field, SQLModel


class ReminderStatus(str, Enum):
    SCHEDULED = "Scheduled"
    COMPLETED = "Completed"
    FAILED = "Failed"


class Reminder(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)

    title: str
    message: str
    phone: str

    
    scheduled_at: datetime
    timezone: str

    status: ReminderStatus = Field(default=ReminderStatus.SCHEDULED)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_error: Optional[str] = None
