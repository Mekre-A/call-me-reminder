from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from db import get_session
from models import Reminder, ReminderStatus
from schemas import ReminderCreate, ReminderRead, ReminderUpdate

from typing import Optional
from sqlmodel import select, or_


router = APIRouter(prefix="/reminders", tags=["reminders"])

@router.get("", response_model=list[ReminderRead])
def list_reminders(
    status: Optional[ReminderStatus] = None,
    q: Optional[str] = None,
    session: Session = Depends(get_session),
):
    stmt = select(Reminder)

    if status is not None:
        stmt = stmt.where(Reminder.status == status)

    if q:
        like = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(
                Reminder.title.ilike(like),
                Reminder.message.ilike(like),
                Reminder.phone.ilike(like),
            )
        )

    stmt = stmt.order_by(Reminder.scheduled_at.asc())

    reminders = session.exec(stmt).all()
    return reminders


@router.post("", response_model=ReminderRead, status_code=201)
def create_reminder(payload: ReminderCreate, session: Session = Depends(get_session)):
    
    if payload.scheduled_at <= datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="scheduled_at must be in the future")
    
    reminder = Reminder(
        title=payload.title.strip(),
        message=payload.message.strip(),
        phone=payload.phone.strip(),
        scheduled_at=payload.scheduled_at,
        timezone=payload.timezone,
        status=ReminderStatus.SCHEDULED,
    )


    session.add(reminder)
    session.commit()
    session.refresh(reminder) 

    return reminder

@router.get("", response_model=list[ReminderRead])
def list_reminders(
    status: Optional[ReminderStatus] = None,
    q: Optional[str] = None,
    session: Session = Depends(get_session),
):
    stmt = select(Reminder)

    if status is not None:
        stmt = stmt.where(Reminder.status == status)

    if q:
        like = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(
                Reminder.title.ilike(like),
                Reminder.message.ilike(like),
                Reminder.phone.ilike(like),
            )
        )

    
    stmt = stmt.order_by(Reminder.scheduled_at.asc())

    reminders = session.exec(stmt).all()
    return reminders

def get_reminder_or_404(session: Session, reminder_id: str) -> Reminder:
    reminder = session.get(Reminder, reminder_id)
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return reminder


@router.get("/{reminder_id}", response_model=ReminderRead)
def get_reminder(reminder_id: str, session: Session = Depends(get_session)):
    reminder = get_reminder_or_404(session, reminder_id)
    return reminder


@router.patch("/{reminder_id}", response_model=ReminderRead)
def update_reminder(
    reminder_id: str,
    payload: ReminderUpdate,
    session: Session = Depends(get_session),
):
    reminder = get_reminder_or_404(session, reminder_id)

    data = payload.model_dump(exclude_unset=True)

    
    if "scheduled_at" in data and data["scheduled_at"] is not None:
        if data["scheduled_at"] <= datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="scheduled_at must be in the future")
        else: 
            reminder.status = ReminderStatus.SCHEDULED

    for key, value in data.items():
        setattr(reminder, key, value)

    reminder.updated_at = datetime.now(timezone.utc).replace(tzinfo=None) 

    session.add(reminder)
    session.commit()
    session.refresh(reminder)

    return reminder


@router.delete("/{reminder_id}", status_code=204)
def delete_reminder(reminder_id: str, session: Session = Depends(get_session)):
    reminder = get_reminder_or_404(session, reminder_id)
    session.delete(reminder)
    session.commit()
    return None





