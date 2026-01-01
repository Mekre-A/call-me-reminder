from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import create_db_and_tables
from routers.reminders import router as reminders_router
import asyncio
from scheduler import run_once


app = FastAPI(title="Call Me Reminder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    create_db_and_tables()
    asyncio.create_task(scheduler_loop())

async def scheduler_loop():
    while True:
        try:
            run_once()
        except Exception as e:
            print("Scheduler error:", e)
        await asyncio.sleep(5) 


app.include_router(reminders_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
