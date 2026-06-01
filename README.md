# InterviewAI Pro

> AI-powered mock interview platform — HR, DSA, System Design, Behavioral & Live Coding

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Quick Start](#quick-start)
4. [Environment Variables](#environment-variables)
5. [API Documentation](#api-documentation)
6. [Deployment](#deployment)
7. [Key Features](#key-features)

---

## Tech Stack

| Layer        | Technology                                       |
|--------------|--------------------------------------------------|
| Frontend     | React 18 + Vite + Tailwind CSS                   |
| Animations   | Framer Motion                                    |
| State        | Zustand                                          |
| Code Editor  | Monaco Editor (@monaco-editor/react)             |
| Forms        | React Hook Form                                  |
| Backend      | Node.js + Express                                |
| Database     | MongoDB + Mongoose                               |
| AI           | OpenAI GPT-4o (`openai` SDK)                     |
| Auth         | JWT (access + refresh tokens) + bcrypt           |
| Voice        | Web Speech API (SpeechRecognition + Synthesis)   |
| Real-time    | Socket.IO                                        |
| Logging      | Winston                                          |

---

## Project Structure

```
interviewai-pro/
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios instance + API modules
│   │   │   ├── axios.js       # Axios with auto-refresh interceptor
│   │   │   ├── auth.api.js
│   │   │   ├── interview.api.js
│   │   │   └── index.js       # analytics, coding, resume, user APIs
│   │   ├── components/
│   │   │   └── ui/            # Button, Card, Badge, Input, Toggle, ScoreRing, VoiceVisualizer
│   │   ├── hooks/
│   │   │   ├── useVoice.js    # Web Speech API abstraction
│   │   │   ├── useTimer.js    # Countdown + countup timer
│   │   │   └── useTypewriter.js # Character-by-character text animation
│   │   ├── layouts/
│   │   │   ├── AppLayout.jsx  # Sidebar + topbar shell
│   │   │   └── AuthLayout.jsx # Auth pages shell
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── InterviewSelect.jsx
│   │   │   ├── InterviewRoom.jsx  # Live AI interview session
│   │   │   ├── Feedback.jsx       # Post-interview results
│   │   │   ├── CodingRound.jsx    # Monaco editor + AI eval
│   │   │   ├── ResumeAnalyzer.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── NotFound.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx  # Protected + guest routes
│   │   ├── store/
│   │   │   ├── authStore.js   # Zustand auth (login/logout/rehydrate)
│   │   │   └── interviewStore.js # Active session state
│   │   └── styles/
│   │       └── globals.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── config/
    │   │   ├── database.js    # MongoDB connection
    │   │   └── openai.js      # OpenAI client singleton
    │   ├── controllers/
    │   │   ├── auth.controller.js
    │   │   └── interview.controller.js
    │   ├── middleware/
    │   │   ├── auth.middleware.js   # JWT protect + adminOnly
    │   │   ├── rateLimiter.js       # general / AI / auth limiters
    │   │   ├── errorHandler.js      # Global async error handler
    │   │   └── notFound.js
    │   ├── models/
    │   │   ├── User.model.js
    │   │   ├── Interview.model.js
    │   │   ├── CodingSubmission.model.js
    │   │   └── Resume.model.js
    │   ├── routes/
    │   │   ├── auth.routes.js
    │   │   ├── user.routes.js
    │   │   ├── interview.routes.js
    │   │   ├── ai.routes.js
    │   │   ├── coding.routes.js
    │   │   ├── resume.routes.js
    │   │   ├── analytics.routes.js
    │   │   └── admin.routes.js
    │   ├── services/
    │   │   └── ai.service.js  # All OpenAI calls (questions/feedback/eval)
    │   ├── prompts/
    │   │   └── index.js       # All GPT system prompts
    │   ├── sockets/
    │   │   └── index.js       # Socket.IO real-time events
    │   ├── utils/
    │   │   ├── logger.js      # Winston logger
    │   │   ├── jwt.js         # Sign / verify tokens
    │   │   ├── response.js    # Standardised API responses
    │   │   └── problems.js    # Coding problem bank
    │   ├── validators/
    │   │   └── validate.js    # express-validator middleware
    │   └── server.js          # Express app entry point
    └── package.json
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key

### 1. Clone & Install

```bash
git clone https://github.com/yourname/interviewai-pro.git
cd interviewai-pro

# Backend
cd backend
npm install
cp .env.example .env       # Fill in MONGODB_URI, JWT_SECRET, OPENAI_API_KEY

# Frontend
cd ../frontend
npm install
cp .env.example .env       # Set VITE_API_URL
```

### 2. Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open **http://localhost:5173**

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/interviewai_pro

JWT_SECRET=your_super_secret_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
AI_RATE_LIMIT_MAX=20

FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=InterviewAI Pro
```

---

## API Documentation

### Auth

| Method | Endpoint              | Auth | Description             |
|--------|-----------------------|------|-------------------------|
| POST   | `/api/auth/register`  | —    | Create account          |
| POST   | `/api/auth/login`     | —    | Login, returns tokens   |
| POST   | `/api/auth/refresh`   | —    | Rotate access token     |
| POST   | `/api/auth/logout`    | ✅   | Logout (stateless)      |
| GET    | `/api/auth/me`        | ✅   | Get current user        |

### Interviews

| Method | Endpoint                        | Auth | Description                  |
|--------|---------------------------------|------|------------------------------|
| POST   | `/api/interviews/start`         | ✅   | Start session, get questions |
| GET    | `/api/interviews`               | ✅   | List user interviews         |
| GET    | `/api/interviews/:id`           | ✅   | Get single interview         |
| POST   | `/api/interviews/:id/answer`    | ✅   | Submit answer, get AI reply  |
| POST   | `/api/interviews/:id/complete`  | ✅   | Complete + generate feedback |
| DELETE | `/api/interviews/:id`           | ✅   | Delete interview             |

### Coding

| Method | Endpoint                   | Auth | Description              |
|--------|----------------------------|------|--------------------------|
| GET    | `/api/coding/problems`     | ✅   | List problems            |
| GET    | `/api/coding/problems/:id` | ✅   | Get problem              |
| POST   | `/api/coding/submit`       | ✅   | Submit + AI evaluate     |
| GET    | `/api/coding/submissions`  | ✅   | User submission history  |

### Resume

| Method | Endpoint             | Auth | Description                    |
|--------|----------------------|------|--------------------------------|
| POST   | `/api/resume/upload` | ✅   | Upload PDF/DOCX + AI analyse   |
| GET    | `/api/resume`        | ✅   | Get latest resume analysis     |
| GET    | `/api/resume/all`    | ✅   | List all resume uploads        |

### Analytics

| Method | Endpoint                      | Auth | Description            |
|--------|-------------------------------|------|------------------------|
| GET    | `/api/analytics/summary`      | ✅   | Dashboard stats        |
| GET    | `/api/analytics/trend?days=30`| ✅   | Score trend data       |
| GET    | `/api/analytics/leaderboard`  | ✅   | Top users by XP        |

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Push to GitHub → connect repo in Vercel
# Set environment variables in Vercel dashboard
```

### Backend → Render

1. Create a new **Web Service** on Render
2. Connect your GitHub repo, set root to `backend/`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all `.env` variables in Render's environment settings
6. Set `MONGODB_URI` to your MongoDB Atlas connection string
7. Set `FRONTEND_URL` to your Vercel deployment URL

### MongoDB → Atlas

```
mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/interviewai_pro?retryWrites=true&w=majority
```

---

## Key Features

- **JWT Auth** — Access + refresh token rotation, persistent login via localStorage
- **AI Interview** — GPT-4o generates questions, responds in real-time, produces structured feedback
- **Voice** — Web Speech API for recording answers + TTS for AI question delivery
- **Monaco Editor** — Multi-language code editor with tab support and syntax highlighting
- **Resume AI** — PDF/DOCX upload → text extraction → GPT-4o analysis → ATS score
- **Socket.IO** — Real-time transcript broadcasting for live session events
- **Rate Limiting** — Separate limiters for general API (100/15min) and AI endpoints (20/15min)
- **Error Handling** — Global async error handler covers Mongoose, JWT, and OpenAI errors
- **Streak & XP** — Gamification system updating on every completed interview
- **Responsive** — Mobile sidebar drawer, responsive grids throughout
