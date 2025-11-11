EventXM – Full‑Stack Event Management System

Overview
EventXM lets customers discover events, register, download QR‑coded PDF tickets, and post reviews, while organizers create/manage events, see participants, export CSVs, and perform real‑time check‑ins.

Tech Stack
- Backend: Node.js, Express.js, MongoDB (Mongoose), JWT auth
- Frontend: React (Vite), React Router, Axios, Tailwind CSS
- Realtime: Socket.IO (server + client)
- PDFs/QR: html2canvas + jsPDF for tickets; custom QR
- Tooling: ESLint, Prettier, Nodemon, PostCSS

Monorepo Structure
- backend/ – Express API, Socket.IO, MongoDB models, routes, controllers
- frontend/ – Vite React app (Tailwind), pages and hooks

Getting Started
Prerequisites
- Node.js 18+
- MongoDB running locally or a connection string

1) Clone and install
```bash
git clone <your-repo-url>
cd Event-management-system

# Backend deps
cd backend && npm install

# Frontend deps
cd ../frontend && npm install
```
2) Run frontend and backend
Terminal A (backend):
```bash
cd backend
npm run dev
```

Terminal B (frontend):
```bash
cd frontend
npm run dev
```