# 📘 Building Management System — Full-Stack Application

A complete full-stack **Building Management System** built with:

- **Spring Boot 4 + Java 17**
- **Next.js 14 (App Router) + React + TailwindCSS**
- **Docker + Docker Compose**

This system manages rooms inside a building, their temperatures, types, statuses (Heating / Cooling / Neutral), and allows full CRUD operations with a clean, modern UI.

---

# 🚀 Features

## Backend (Spring Boot)
- In-memory building model
- Add, edit, delete rooms
- Update requested temperature
- Automatic heating/cooling recalculation
- Supports Apartment & Common Room types
- REST API JSON responses
- Dockerized backend
- Lightweight, no database required

## Frontend (Next.js 14)
- Dark modern UI
- Add room form with validation
- Room editing modal
- Real-time search (Room ID or Owner)
- Status color indicators
- Summary panel (total, heating, cooling)
- Full CRUD connected to backend
- Dockerized frontend
- Works seamlessly in Docker Compose environment

---

# 🏗️ Project Architecture

Project/
│
├── Backend/ # Spring Boot application
│ ├── src/main/java/com/building/backend/
│ │ ├── controller/ # BuildingController
│ │ ├── model/ # Room, Apartment, CommonRoom, Building
│ │ ├── service/ # BuildingService
│ │ └── BackendApplication.java
│ ├── Dockerfile
│ └── pom.xml
│
├── frontend/ # Next.js 14 application
│ ├── app/ # App Router pages
│ ├── components/ # AddRoomForm, EditRoomModal, UI parts
│ ├── lib/api.ts # API wrapper
│ ├── Dockerfile
│ └── package.json
│
└── docker-compose.yml # Full multi-container setup

yaml
Copy code

🐳 Docker Setup
✔ Build & Run (Docker Compose)
In the project root:

bash
Copy code
docker compose up --build
Services:

Service	Port	Description
backend	8080	Spring Boot API
frontend	3000	Next.js Web UI

Frontend automatically connects using:

ini
Copy code
NEXT_PUBLIC_BACKEND_URL=http://backend:8080
▶️ Running Locally (Without Docker)
Backend
bash
Copy code
cd Backend
./mvnw spring-boot:run
Backend:
http://localhost:8080/api/building

Frontend
bash
Copy code
cd frontend
npm install
npm run dev
Frontend:
http://localhost:3000

---


