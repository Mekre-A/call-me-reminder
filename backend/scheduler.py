from datetime import datetime, timezone
from sqlmodel import Session, select

from db import engine
from models import Reminder, ReminderStatus
from vapi_client import place_call


def run_once() -> int:

    now = datetime.now(timezone.utc)

    with Session(engine) as session:
        stmt = (
            select(Reminder)
            .where(Reminder.status == ReminderStatus.SCHEDULED)
            .where(Reminder.scheduled_at <= now)
            .order_by(Reminder.scheduled_at.asc())
        )

        due = session.exec(stmt).all()

        processed = 0

        for reminder in due:
            try:
                place_call(reminder.phone, reminder.message)
                reminder.status = ReminderStatus.COMPLETED
                reminder.last_error = None
            except Exception as e:
                reminder.status = ReminderStatus.FAILED
                reminder.last_error = str(e)

            reminder.updated_at = datetime.now(timezone.utc)
            session.add(reminder)
            processed += 1

        session.commit()
        return processed
