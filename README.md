#  MediCare — Online Medication and Prescription Tracker

> A smart, role-based digital health platform connecting Doctors, Patients, Staff and Admins for seamless prescription management and real-time medication adherence tracking.

---

##  Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Tables](#database-tables)
- [Team](#team)

---

## Overview

MediCare solves a real-world healthcare problem — **medication non-adherence**. Patients forget doses, doctors have no visibility into adherence, and hospital staff manually track everything with no central system.

MediCare fixes this with:
- **Digital prescriptions** with per-slot time windows (morning / afternoon / night)
- **Auto-classification** of every dose as `UPCOMING`, `PENDING`, `ON TIME`, `LATE`, or `MISSED` — driven entirely by the backend clock
- **Live dashboards** for all four roles
- **AI chatbot** powered by Groq LLM that reads the patient's actual prescription data from the database

---

## Features

###  Admin
- Approve or reject doctor registration requests
- Activate / deactivate patient and staff accounts
- View system-wide statistics and user management

###  Doctor
- Create digital prescriptions with morning, afternoon and night slots
- Set meal type (before / after) and exact time window per slot
- Accept or reject patient connection requests
- Monitor patient medication adherence over time

###  Patient
- View today's full medicine schedule auto-generated from active prescriptions
- Mark medicines as taken — system auto-decides **On Time** or **Late** based on clock time
- Chat with the AI assistant about dosage, timing and side effects
- View full prescription history with per-slot details

###  Staff
- Monitor all patients across all doctors from one live dashboard
- Mark medicines on behalf of patients during shift

###  AI Medication Assistant
- Reads the patient's **real prescription data** from MySQL
- Powered by **Groq API** using `llama-3.1-8b-instant` model
- Saves full chat history to database
- Never diagnoses — always ends with: *"Please consult your doctor for medical advice."*

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Material UI v5, Recharts, Axios |
| Backend | Spring Boot 3, Java 17, Spring Data JPA, Spring Security |
| Database | MySQL 8 (11 tables auto-created by Hibernate) |
| Authentication | JWT + BCrypt |
| AI Service | Python FastAPI, Groq API, Llama 3.1 8B Instant |
| AI DB Driver | mysql-connector-python |

---

## Project Structure

```
online-medication-and-prescription-tracker/
│
├── frontend/                          # React 18 app
│   └── src/
│       ├── components/
│       │   ├── layout/                # Role-based layouts
│       │   └── common/
│       │       └── AiChat.js          # AI chatbot component
│       ├── context/
│       │   └── AuthContext.js         # JWT auth context
│       ├── pages/
│       │   ├── admin/                 # Admin dashboards
│       │   ├── doctor/                # Doctor dashboards
│       │   ├── patient/               # Patient dashboards
│       │   └── staff/                 # Staff dashboards
│       └── services/
│           └── api.js                 # Axios API config
│
├── backend/                           # Spring Boot 3 app
│   └── src/main/java/com/health/medicare/
│       ├── config/                    # Security, CORS, password encoder
│       ├── controller/                # REST controllers
│       ├── dto/                       # Request / Response DTOs
│       ├── model/                     # JPA entities (11 tables)
│       ├── repository/                # Spring Data JPA repos
│       ├── security/                  # JWT util, Role enum
│       └── service/                   # Business logic + implementations
│
└── AI_SERVER/                         # Python FastAPI AI service
    ├── main.py                        # FastAPI app entry point
    ├── requirements.txt
    ├── .env                           # Groq API key + DB credentials
    ├── services/
    │   ├── database_service.py        # Reads prescriptions, saves chat history
    │   ├── llm_service.py             # Groq API call
    │   └── medication_context.py      # Formats prescription data for prompt
    ├── routes/
    │   └── chat.py                    # POST /api/chat/message
    └── models/
        └── schemas.py                 # Pydantic request/response models
```

---

## Prerequisites

Make sure you have the following installed:

| Tool | Version |
|---|---|
| Java | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| npm | 9+ |
| Python | 3.11+ |
| MySQL | 8.0+ |

---

## Getting Started

Run all three services in **separate terminals**.

### 1️⃣ MySQL

Make sure your MySQL server is running on port `3306`.
Create a database named `medicare_db`:

```sql
CREATE DATABASE medicare_db_main;
```

All 11 tables are auto-created by Hibernate when Spring Boot starts.

---

### 2️⃣ Backend — Spring Boot

```bash
cd backend
mvn spring-boot:run
```

Runs on **http://localhost:8321**

---

### 3️⃣ AI Service — Python FastAPI

```bash
cd AI_SERVER

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

Runs on **http://localhost:8000**

Test it: open `http://localhost:8000` — you should see:
```json
{ "message": "Medication AI Service is running on port 8000!" }
```

---

### 4️⃣ Frontend — React

```bash
cd frontend

# Install packages (first time only)
npm install

# Start the app
npm start
```

Runs on **http://localhost:3000**

---

## Environment Variables

Create a `.env` file inside `AI_SERVER/` with the following values:

```env
# Get a free key from https://console.groq.com
GROQ_API_KEY=your_groq_api_key_here

# MySQL — same database as Spring Boot
DB_HOST=localhost
DB_PORT=3306
DB_NAME=medicare_db
DB_USER=root
DB_PASSWORD=your_mysql_password_here
```

Also update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/medicare_db
spring.datasource.username=root
spring.datasource.password=your_mysql_password_here
spring.jpa.hibernate.ddl-auto=update
server.port=8321
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register any user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Patient
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/patients/{id}/dashboard` | Today's medicine schedule |
| POST | `/api/medication-tracking/mark` | Mark a medicine as taken |
| GET | `/api/patients/{id}/prescriptions` | Full prescription history |
| PUT | `/api/patients/{id}/profile` | Update patient profile |

### Doctor
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/prescriptions` | Create a new prescription |
| GET | `/api/doctors/{id}/patients` | Get all connected patients |
| GET | `/api/doctors/{id}/requests` | View pending patient requests |
| PUT | `/api/doctors/{id}/requests/{reqId}` | Accept / reject request |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/doctors/pending` | Get doctors awaiting approval |
| PUT | `/api/admin/doctors/{id}/approve` | Approve a doctor |
| GET | `/api/admin/users` | View all users |

### AI Service
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat/message` | Send a message to the AI chatbot |
| GET | `/api/chat/health` | Health check |

---

## Database Tables

All tables are auto-created by Hibernate on first startup:

| Table | Description |
|---|---|
| `admin` | Admin accounts |
| `doctors` | Doctor profiles and approval status |
| `patients` | Patient profiles |
| `staff` | Staff accounts |
| `prescriptions` | Prescriptions issued by doctors |
| `prescription_medicines` | Per-medicine slot config inside a prescription |
| `medicines` | Medicine master list |
| `doctor_patients` | Doctor-patient relationships |
| `patient_requests` | Patient connection requests to doctors |
| `medication_tracking` | Per-dose tracking records with status |
| `chat_history` | AI chatbot conversation history |

---

## Team

| Name | Role |
|---|---|
| G Namitha | Frontend Developer |
| P Maruthi Sreeram | Backend Developer |
| B Pramodhini | AI Chatbot Developer |
| S Sathwik | Testing & QA |

**Mentor:** Vinay Prashant

---

## Ports Summary

| Service | Port |
|---|---|
| React Frontend | 3000 |
| Spring Boot Backend | 8321 |
| Python AI Service | 8000 |
| MySQL Database | 3306 |

---

> Built during internship — 2026
