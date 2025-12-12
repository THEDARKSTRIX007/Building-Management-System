# 📘 Building Management System — Full-Stack Application

A complete full-stack **Building Management System** built with **Spring Boot**, **Next.js**, and orchestrated entirely by **Docker Compose**.

This system manages rooms inside a building, tracks their temperatures, and automatically adjusts their Heating/Cooling statuses based on a central requested temperature and specific tolerance thresholds.

---

# 🚀 Key Features and Enhancements

## Backend (Spring Boot 4 + Java 17)

The backend is built with Spring Boot and utilizes Java's scheduling framework to simulate real-world conditions.

* **Database:** Uses **PostgreSQL** for robust and persistent data retention, managed by Docker Compose.
* **Data Models:** Supports polymorphic Room types: **Apartment** (with Owner) and **Common Room** (categorized as Gym, Library, Laundry).
* **Full CRUD:** Complete ability to Add, Edit, and Delete rooms via REST API.
* **Automatic Control Logic (Extras Implemented):**
    * **Temperature Drift:** Room temperatures slowly increase or decrease (0.2°C per cycle) when heating or cooling is active.
    * **Scheduled Recalculation:** A background task runs every **10 seconds** to check current temperatures and re-evaluate the heating/cooling status for every room.
    * **Tolerance Zone:** Heating/Cooling systems are disabled (Status: Neutral) when the room temperature is within ±0.5°C of the Requested Temperature, conserving energy.
* **Dockerized:** Ready to deploy via Docker Compose.

## Frontend (Next.js 14 + React + TailwindCSS)

The frontend provides a modern, responsive interface for management and monitoring.

* **Modern UI:** Dark theme, clean layout, and clear status color indicators.
* **Real-Time Monitoring:** The room list automatically refreshes every **5 seconds** to reflect the temperature drift and status changes driven by the backend's scheduled task.
* **Interaction:** Intuitive forms for setting the global requested temperature and managing individual room details.
* **Search & Filter:** Real-time search capabilities across **Room ID, Owner Name, and Common Room Type**.
* **Dockerized:** Works seamlessly within the Docker network environment.

---

# Assumptions and Decisions

* Tolerance Value: The value for "close enough" was set to a fixed 0.5°C in BuildingService.java.
* Drift Rate: The temperature change rate (drift) was set to 0.2°C per tick.
* Scheduled Interval: The backend recalculates temperature and status every 10 seconds.
* Frontend Auto-Refresh: Polling was added to the main component (page.tsx) to fetch new data every 5 seconds to ensure users see the automated temperature drift in near real-time.
* Multiple Common Rooms: The architecture allows for multiple instances of the same common room type (e.g., "Gym-East" and "Gym-West") as each room has a unique ID but shares a commonType property.

# 🏗️ Project Architecture

Project/ │ ├── Backend/ # Spring Boot application │ ├── src/main/java/com/building/backend/ │ │ ├── controller/ # BuildingController │ │ ├── model/ # Room, Apartment, CommonRoom, BuildingSettings │ │ ├── service/ # BuildingService (Contains @Scheduled logic and control rules) │ │ └── BackendApplication.java (@EnableScheduling) │ ├── Dockerfile │ └── pom.xml │ ├── frontend/ # Next.js 14 application │ ├── app/ # App Router pages │ ├── components/ # AddRoomForm, EditRoomModal, etc. │ ├── lib/api.ts # API wrapper with empty body handling │ ├── Dockerfile │ └── package.json │ └── docker-compose.yml # Full multi-container setup (Includes PostgreSQL service)

---

# 🐳 Deployment Instructions

### 1. Build and Run (Recommended)

Navigate to the root directory of the project and run the following command. Docker Compose will automatically build both images, set up the network, and start the services, including the **PostgreSQL database**.

```bash
docker compose up --build

Access the ApplicationOnce the services are running:
ServiceAddressWeb UI (Frontend)http://localhost:3000API 
(Backend)http://localhost:8080/api/building
