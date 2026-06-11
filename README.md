# 🎮 eSports Tournament Database System

<p align="center">
  <img src="https://img.shields.io/badge/version-v13.0.0-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/status-active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/license-academic-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql" />
</p>

## 📹 Video Demo

<p align="center">
  <a href="https://drive.google.com/file/d/1r1Nr2p-P64E8iyHAccyi7GYlkMX5uzKQ/preview" target="_blank">
    <img src="https://drive.google.com/thumbnail?id=1r1Nr2p-P64E8iyHAccyi7GYlkMX5uzKQ&sz=w680" alt="Video Demo" width="680" />
  </a>
</p>

<p align="center">
  <a href="https://drive.google.com/file/d/1r1Nr2p-P64E8iyHAccyi7GYlkMX5uzKQ/view">
    <img src="https://img.shields.io/badge/▶%20Ver%20Video%20Demo-4285F4?style=for-the-badge&logo=google-drive&logoColor=white" />
  </a>
</p>

---

# 📚 Table of Contents

- [🎮 eSports Tournament Database System](#-esports-tournament-database-system)
- [📚 Table of Contents](#-table-of-contents)
- [📖 Project Overview](#-project-overview)
  - [🎯 Project Objectives](#-project-objectives)
- [🚀 Main Features](#-main-features)
- [👥 Team Roles](#-team-roles)
- [🗂️ Project Structure](#️-project-structure)
- [⚙️ Installation Guide](#️-installation-guide)
  - [1️⃣ Clone Repository](#1️⃣-clone-repository)
- [2️⃣ Backend Setup](#2️⃣-backend-setup)
  - [Enter backend folder](#enter-backend-folder)
  - [Install dependencies](#install-dependencies)
  - [Configure environment variables](#configure-environment-variables)
  - [Run backend server](#run-backend-server)
- [3️⃣ Frontend Setup](#3️⃣-frontend-setup)
  - [Enter frontend folder](#enter-frontend-folder)
  - [Install dependencies](#install-dependencies-1)
  - [Start development server](#start-development-server)
- [🛠️ Technologies Used](#️-technologies-used)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
  - [Development Tools](#development-tools)
  - [Architecture](#architecture)
- [✨ Features Implemented](#-features-implemented)
  - [👤 Authentication System](#-authentication-system)
  - [🏆 Tournament Management](#-tournament-management)
  - [📈 Statistics Dashboard](#-statistics-dashboard)
  - [🖥️ Responsive User Interface](#️-responsive-user-interface)
- [🔒 Security Features](#-security-features)
- [🧪 Testing \& Debugging](#-testing--debugging)
- [📄 Documentation](#-documentation)
- [🤝 Contributions](#-contributions)
  - [Frontend Development](#frontend-development)
  - [Backend Development](#backend-development)
  - [Database Development](#database-development)
  - [Quality Assurance](#quality-assurance)
- [🤖 AI-Assisted Development](#-ai-assisted-development)
- [📌 Current Version](#-current-version)
- [⭐ Repository](#-repository)

---

# 📖 Project Overview

The **eSports Tournament Database System** is a full-stack web application designed to simplify the organization and management of competitive gaming tournaments.

This project provides an efficient platform where administrators, players, and organizers can manage tournaments, registrations, matches, statistics, and gaming activities in a centralized environment.

The system was developed following modern software engineering practices, combining a responsive frontend, scalable backend architecture, and relational database management.

---

## 🎯 Project Objectives

- Simplify tournament organization and administration
- Improve player registration and management
- Provide secure authentication and access control
- Track tournament activity and player statistics
- Maintain scalable and optimized database structures
- Deliver a modern and responsive user experience

---

# 🚀 Main Features

✅ User Authentication System  
✅ Tournament Creation & Management  
✅ Player Registration System  
✅ Activity Logging  
✅ Statistics Dashboard  
✅ Responsive Admin Panel  
✅ Role-Based Access Control  
✅ REST API Integration  
✅ Dynamic Game Carousel  
✅ Password Reset via Email  
✅ Admin Management (Create / List / Demote)  
✅ Animated Particle Background  
✅ Cyber Neon Gaming Theme  
✅ Responsive Design for Multiple Devices  
✅ Match & Bracket Management (Auto-generate, Report Results)  
✅ Player Profiles with Win/Loss Stats  
✅ Global & Per-Tournament Leaderboards  
✅ In-App Notifications (Real-time)  
✅ Admin Registration Management  
✅ Tournament Results & Standings  
✅ Advanced Statistics (Activity Timeline, Game Popularity, Top Players)  

---

# 👥 Team Roles

| Role | Member |
|:--|:--|
| 📊 Analyst & Designer | Galán Torres Citlalli |
| 💾 SQL Developer | Olazo Caamaño Emmanuel |
| 🔎 Query Master | Jimenez Solis Caleb |
| 🧪 QA / Tester | Lopez Gil Dilan Osmar |
| 🛡️ Database Administrator | Aguilar Medina Angel Uriel |

---

# 🗂️ Project Structure

```txt
VideoGames-Tournament/
│
├── backend/
│   ├── controllers/
│   │   └── usersController.js
│   │   └── tournamentsController.js
│   │   └── gamesController.js
│   │   └── activityController.js
│   │   └── matchesController.js
│   │   └── leaderboardController.js
│   │   └── notificationController.js
│   │   └── statsController.js
│   ├── routes/
│   │   └── matchesRoutes.js
│   │   └── leaderboardRoutes.js
│   │   └── notificationRoutes.js
│   │   └── statsRoutes.js
│   ├── uploads/
│   ├── utils/
│   │   ├── authMiddleware.js
│   │   ├── activityLogger.js
│   │   ├── socketEmitter.js
│   │   └── emailService.js
│   ├── db.js
│   └── index.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── BackgroundAnimation.jsx
│       │   ├── CreateTournament.jsx
│       │   ├── TournamentList.jsx
│       │   ├── ActivityList.jsx
│       │   ├── PlayersList.jsx
│       │   ├── RegisterTournament.jsx
│       │   ├── TournamentAutocomplete.jsx
│   │   ├── AdminStats.jsx
│   │   ├── Modal.jsx
│   │   └── BracketViewer.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Admin.jsx
│       │   ├── Player.jsx
│       │   ├── AdminLogin.jsx
│       │   ├── UserRegister.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Profile.jsx
│   │   ├── Leaderboards.jsx
│   │   └── TournamentResults.jsx
│       ├── services/
│       │   ├── api.js
│       │   ├── userService.js
│   │   ├── tournamentService.js
│   │   ├── matchService.js
│   │   ├── leaderboardService.js
│   │   ├── notificationService.js
│   │   └── socket.js
│       ├── utils/
│       │   └── formatDate.js
│       ├── resources/
│       ├── App.jsx
│       └── index.js
│
├── consults/
│   ├── password_resets.sql
│   ├── notifications.sql
│   └── ...
├── docs/
│   ├── SRS.md
│   └── scrum/
├── CHANGELOG.md
├── README.md
└── package.json
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/olazocaamano/VideoGames-Tournament.git
```

---

# 2️⃣ Backend Setup

## Enter backend folder

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

## Configure environment variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=esports_tournaments
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h

# SMTP (optional — without it, uses Ethereal test emails)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

FRONTEND_URL=http://localhost:3000
```

## Run backend server

```bash
node index.js
```

Or using nodemon:

```bash
npx nodemon index.js
```

---

# 3️⃣ Frontend Setup

## Enter frontend folder

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm start
```

If using Vite:

```bash
npm run dev
```

---

# 🛠️ Technologies Used

## Frontend

- React.js
- React Router DOM
- Axios
- Chart.js
- react-chartjs-2
- CSS3
- JavaScript (ES6+)
- Canvas API

---

## Backend

- Node.js
- Express.js
- MySQL2
- bcrypt
- dotenv
- CORS
- jsonwebtoken
- Nodemailer
- Socket.io

---

## Database

- MySQL
- Relational Database Design
- SQL Queries
- Foreign Keys & Constraints
- Database Normalization

---

## Development Tools

- Visual Studio Code
- Git
- GitHub
- npm
- Postman
- MySQL Workbench

---

## Architecture

- REST API
- MVC Pattern (Model - View - Controller)
- Client-Server Architecture
- Modular Backend Structure

---

# ✨ Features Implemented

## 👤 Authentication System

- Secure login system with JWT tokens
- Password encryption using bcrypt
- User validation
- Token-based session management with 24h expiry
- Role-based access control (admin / player)
- Axios interceptor for automatic token attachment

---

## 🏆 Tournament Management

- Create, edit, delete tournaments
- Tournament registration system with autocomplete
- Match organization with automatic bracket generation
- Round progression (Round 1 → Quarter-finals → Semi-finals → Final)
- Report match results with winner validation
- Visual bracket viewer for tournament progression

---

## 👤 Player Profiles

- Public profile pages with player statistics
- Win/Loss tracking and win rate calculation
- Total matches and tournaments played
- Recent match history with results

---

## 🏅 Leaderboards

- Global rankings (wins, matches, win rate, tournaments)
- Per-tournament leaderboards
- Medal icons (gold, silver, bronze) for top 3
- Filterable by tournament

---

## 🔔 Notifications System

- Real-time in-app notifications via Socket.io
- Match assignment, win/loss, and registration notifications
- Unread badge indicator in player panel
- "Mark all as read" action

---

## 📈 Statistics Dashboard

- Tournament statistics visualization
- Player activity tracking
- Dynamic charts using Chart.js

---

## 🖥️ Responsive User Interface

- Mobile-friendly design
- Responsive admin dashboard
- Optimized navigation flow
- Interactive UI components

---

# 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based route authorization (admin / player)
- Server-side auth middleware for all protected endpoints
- Environment variable protection (`.env`)
- API input validation
- Duplicate account prevention
- Error handling improvements
- Secure backend routing

---

# 🧪 Testing & Debugging

The project includes multiple testing and debugging processes such as:

- Frontend and backend integration testing
- API endpoint validation
- Database query testing
- Routing issue fixes
- UI rendering validation
- Error handling improvements

---

# 📄 Documentation

The project documentation includes:

- README.md
- CHANGELOG.md
- Sprint documentation
- Scrum activity reports
- Technical documentation
- Installation and configuration guides

---

# 🤝 Contributions

## Frontend Development

- Designed responsive user interfaces
- Developed React components and pages
- Integrated tournament visualizations
- Improved UX/UI navigation flow

---

## Backend Development

- Developed REST API endpoints
- Implemented authentication logic
- Created tournament management services
- Connected backend with MySQL database

---

## Database Development

- Designed relational database schema
- Created SQL tables and relationships
- Added constraints and foreign keys
- Optimized queries for scalability

---

## Quality Assurance

- Performed integration testing
- Fixed backend/frontend communication issues
- Resolved rendering and routing problems
- Validated application functionality

---

# 🤖 AI-Assisted Development

Artificial Intelligence tools were used to assist in:

- Code debugging
- Technical documentation generation
- Frontend/backend integration improvements
- Error detection and correction
- Development workflow optimization

---

# 📌 Current Version

> Latest Stable Version: **v13.0.0**

📄 Full version history available in:

```txt
CHANGELOG.md
```

---

# ⭐ Repository

If you found this project useful, consider giving it a ⭐ on GitHub.

```bash
https://github.com/olazocaamano/VideoGames-Tournament
```