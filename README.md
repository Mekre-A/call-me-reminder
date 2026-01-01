# Reminder Calls App (Next.js + FastAPI + Vapi)

This project is a take-home assignment implementing a reminder scheduling system with a **Next.js frontend** and a **FastAPI backend**.  

## 1) Prerequisites

- Docker
- Docker Compose
- A Vapi account

---

## 2) Setup Instructions (Step-by-Step)

### Step A — Import the Twilio number into Vapi
1. Create/Log in to Vapi.
2. Create or select an assistant (the assistant will speak the reminder message).
3. Configure the Vapi assistant to read out the `{{reminder_message}}` variable.
4. Import/connect your Twilio phone number inside Vapi.

### Step B — Create backend env file
Create `backend/.env` and fill it with the following variables:

VAPI_BASE_URL=https://api.vapi.ai
VAPI_API_KEY=
VAPI_ASSISTANT_ID=
VAPI_PHONE_NUMBER_ID=

### Step C - Configure port
- Backend runs on port **8000**
- Frontend runs on port **3000**

If these ports are already in use on your machine, update them in the `docker-compose.yml` file.

### Step D - Run
Use the following command from the root folder to start the project
`docker compose up --build`


## 3) Scheduling Explanation
The backend runs an in-process scheduler that continuously checks for reminders that are due. Each reminder is stored with a scheduled date/time, timezone, and a status (Scheduled, Completed, or Failed). At a fixed interval, the scheduler queries for reminders that are still marked as Scheduled and whose scheduled time is less than or equal to the current time. When a due reminder is detected, the backend triggers an outbound call via Vapi, injects the reminder message into the assistant at runtime, and updates the reminder status to Completed on success or Failed if an error occurs. This approach ensures reminders are executed reliably without relying on external cron jobs or background workers.

## 4) Testing the Calling Workflow
Create a reminder scheduled 2 minutes in the future, fill in the form fields, and wait for the call. When the scheduled time is reached, the backend scheduler triggers the call workflow by sending a request to the Vapi service. For simplicity, a reminder is considered Completed once the call request is successfully accepted by Vapi. In-call activities (what happens after the call is initiated) are not recorded by this application. If the call request is rejected by Vapi or errors occur, the reminder is marked Failed and the error is logged. 

