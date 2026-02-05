# EventXM - Campus Event Management System
> A full-stack event management platform for campus events with role-based access control, real-time announcements, QR-coded tickets, and comprehensive event management features.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Role-Based Access](#-role-based-access)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### For Customers (Students)
- 🔍 **Browse Events** - Discover upcoming campus events by category
- 📝 **Register for Events** - Simple one-click registration
- 🎫 **Download QR Tickets** - Get PDF tickets with unique QR codes
- ⭐ **Rate & Review** - Share feedback on attended events
- 🏆 **Earn Points** - Gamification through event participation

### For Organizers
- ➕ **Create Events** - Add new events with posters, descriptions, and details
- 👥 **Manage Participants** - View registered attendees
- 📊 **Export Data** - Download participant lists as CSV
- 📈 **View Analytics** - See registration stats and event performance
- ✅ **Check-in Attendees** - QR code scanning for event entry
- 📋 **Event Details** - Detailed view of each event with statistics

### For Admins
- ✅ **Approve/Reject Events** - Moderate events before they go live
- 👤 **User Management** - Manage all users and roles
- 📢 **Announcements** - Broadcast real-time messages to all users
- 📊 **System Analytics** - Platform-wide statistics and insights

### Platform Features
- 🔐 **Secure Authentication** - JWT-based auth with httpOnly cookies
- 🔄 **Real-time Updates** - Socket.IO for instant notifications
- 🖼️ **Cloud Storage** - Cloudinary integration for event posters
- 📱 **Responsive Design** - Mobile-friendly interface
- 🎨 **Dark Mode** - Theme toggle support
- ⚡ **Fast Performance** - Redis caching and optimized queries

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| Socket.IO | Real-time communication |
| Cloudinary | Image storage & CDN |
| Redis | Caching layer |
| Nodemailer | Email service |
| bcryptjs | Password hashing |
| Helmet | Security headers |
| express-rate-limit | API rate limiting |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI library |
| Vite | Build tool & dev server |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| Tailwind CSS | Utility-first CSS |
| Socket.IO Client | Real-time updates |
| html2canvas | HTML to canvas conversion |
| jsPDF | PDF generation |
| qrcode.react | QR code generation |

### DevOps & Tools
- **Deployment**: Render (Frontend + Backend)
- **Database**: MongoDB Atlas
- **CDN**: Cloudinary
- **Version Control**: Git & GitHub
- **Testing**: Jest, Playwright
- **Code Quality**: ESLint, Prettier

---

## 📁 Project Structure

```
Event-Management-System/
├── backend/
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   │   ├── cloudinary.js    # Cloudinary setup
│   │   │   ├── db.js            # MongoDB connection
│   │   │   └── env.js           # Environment variables
│   │   │
│   │   ├── controllers/         # Business logic
│   │   │   ├── adminController.js      # Admin operations
│   │   │   ├── authController.js       # Authentication
│   │   │   ├── eventController.js      # Event CRUD
│   │   │   ├── registrationController.js  # Registrations
│   │   │   ├── reviewController.js     # Reviews & ratings
│   │   │   └── statsController.js      # Analytics
│   │   │
│   │   ├── middleware/          # Custom middleware
│   │   │   ├── auth.js          # JWT verification
│   │   │   ├── cache.js         # Redis caching
│   │   │   └── roles.js         # Role-based access
│   │   │
│   │   ├── models/              # Mongoose schemas
│   │   │   ├── Event.js         # Event model
│   │   │   ├── Registration.js  # Registration model
│   │   │   ├── Review.js        # Review model
│   │   │   └── User.js          # User model
│   │   │
│   │   ├── routes/              # API routes
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── eventRoutes.js
│   │   │   ├── registrationRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   └── statsRoutes.js
│   │   │
│   │   ├── services/            # External services
│   │   │   └── socket.js        # Socket.IO setup
│   │   │
│   │   └── utils/               # Helper functions
│   │       ├── email.js         # Email utilities
│   │       ├── generateToken.js # JWT generation
│   │       ├── qrcode.js        # QR code generation
│   │       ├── redis.js         # Redis utilities
│   │       └── upload.js        # File upload handling
│   │
│   ├── migrateImagesToCloudinary.js  # Migration script
│   ├── seed.js                       # Database seeding
│   ├── server.js                     # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/          # Reusable components
    │   │   ├── common/          # Shared components
    │   │   ├── events/          # Event-related components
    │   │   ├── layout/          # Layout components
    │   │   └── dashboard/       # Dashboard sections
    │   │
    │   ├── pages/               # Page components
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Events.jsx
    │   │   ├── EventDetails.jsx
    │   │   ├── Dashboard.jsx    # Role-based dashboard
    │   │   └── Profile.jsx
    │   │
    │   ├── hooks/               # Custom hooks
    │   │   ├── useAuth.js
    │   │   ├── useSocket.js
    │   │   └── useTheme.js
    │   │
    │   ├── services/            # API services
    │   │   ├── api.js           # Axios instance
    │   │   ├── authService.js
    │   │   ├── eventService.js
    │   │   └── socketService.js
    │   │
    │   ├── utils/               # Utility functions
    │   │   ├── pdfGenerator.js
    │   │   ├── validators.js
    │   │   └── helpers.js
    │   │
    │   ├── App.jsx              # Main app component
    │   └── main.jsx             # Entry point
    │
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas account) - [Setup](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Cloudinary Account** (free tier) - [Sign up](https://cloudinary.com/)
- **Redis** (optional, for caching) - [Download](https://redis.io/download)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/eventxm.git
cd eventxm
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your API URL
nano .env
```

---

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5050
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eventxm?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=EventXM <noreply@eventxm.com>

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=120
```

### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5050

# Socket.IO
VITE_SOCKET_URL=http://localhost:5050
```

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5050
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Seeding the Database

```bash
cd backend
npm run seed
```

This creates sample data:
- 3 users (customer, organizer, admin)
- 6 sample events
- 1 registration with QR code
- 1 review

**Default Credentials:**
| Role | Email | Password |
|------|-------|----------|
| Customer | customer@example.com | password |
| Organizer | organizer@example.com | password |
| Admin | admin@example.com | password |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5050/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "customer"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Event Endpoints

#### Get All Events
```http
GET /api/events?status=approved&category=Tech
```

#### Get Event by ID
```http
GET /api/events/:id
```

#### Create Event (Organizer Only)
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Tech Talk 2024",
  "description": "Amazing tech event",
  "category": "Tech",
  "date": "2024-12-20",
  "location": "Auditorium A",
  "capacity": 100,
  "poster": <file>
}
```

#### Update Event (Organizer Only)
```http
PATCH /api/events/:id
Authorization: Bearer <token>
```

#### Delete Event (Organizer/Admin)
```http
DELETE /api/events/:id
Authorization: Bearer <token>
```

### Registration Endpoints

#### Register for Event
```http
POST /api/registrations
Authorization: Bearer <token>

{
  "eventId": "65f1234567890abcdef12345"
}
```

#### Get My Registrations
```http
GET /api/registrations/my
Authorization: Bearer <token>
```

#### Get Event Participants (Organizer)
```http
GET /api/registrations/event/:eventId
Authorization: Bearer <token>
```

#### Export Participants CSV (Organizer)
```http
GET /api/registrations/event/:eventId/export
Authorization: Bearer <token>
```

### Review Endpoints

#### Add Review
```http
POST /api/reviews
Authorization: Bearer <token>

{
  "eventId": "65f1234567890abcdef12345",
  "rating": 5,
  "comment": "Great event!"
}
```

#### Get Event Reviews
```http
GET /api/reviews/event/:eventId
```

### Admin Endpoints

#### Approve Event
```http
PATCH /api/admin/events/:id/approve
Authorization: Bearer <token>
```

#### Reject Event
```http
PATCH /api/admin/events/:id/reject
Authorization: Bearer <token>
```

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <token>
```

### Statistics Endpoints

#### Get User Stats
```http
GET /api/stats/user
Authorization: Bearer <token>
```

#### Get Platform Stats (Admin)
```http
GET /api/stats/platform
Authorization: Bearer <token>
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
