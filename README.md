# Study Vision Coaching Centre

A full-stack coaching centre management system built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

**Tagline:** Learn Better • Build Strong Concepts • Achieve More
**Classes:** 1st to 12th | **Phone:** 9354024459

---

## Project Structure

```
study-vision-coaching/
├── src/                    # React frontend (Vite + TypeScript + Tailwind)
│   ├── components/         # Reusable UI components
│   ├── context/            # Auth & Toast context providers
│   ├── layouts/            # Dashboard & Public layouts
│   ├── pages/              # All pages (admin, teacher, student, parent, public)
│   └── lib/                # Supabase client
├── server/                 # Node.js + Express backend (MVC)
│   ├── config/             # Database & app config
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth, validation, error handling
│   ├── models/             # Mongoose models (14 models)
│   ├── routes/             # Express route definitions
│   ├── services/           # Business logic layer
│   ├── utils/              # JWT, error helpers, async handler
│   ├── seed.js             # Demo data seed script
│   ├── .env.example        # Environment variables template
│   └── index.js            # Server entry point
├── supabase/               # Supabase migrations (alternative backend)
├── package.json            # Frontend dependencies
└── vite.config.ts
```

---

## Features

### Public Website
- Home, About, Courses (1st–12th), Faculty, Results, Gallery, Admission/Enquiry, Contact
- Responsive professional UI with Tailwind CSS

### Admin Portal
- Students, Parents, Teachers, Courses, Batches, Attendance, Fees, Notes, Homework, Tests/Marks, Results, Timetable, Notices, Enquiries, Gallery, Reports, Settings

### Teacher Portal
- Assigned students/batches, Attendance, Notes, Homework, Tests, Marks, Timetable

### Student Portal
- Profile, Private Notes, Homework, Attendance, Fees/Receipts, Tests/Results, Timetable, Notices

### Parent Portal
- Child Profile, Attendance, Fees, Results, Homework, Notices

### Security
- JWT-based authentication
- Role-based access control (Admin, Teacher, Student, Parent)
- Private notes protected by access level (PUBLIC / CLASS / BATCH / SELECTED)
- Password hashing with bcryptjs
- Helmet, CORS, rate limiting

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18, Vite 5, TypeScript, Tailwind CSS |
| Backend     | Node.js, Express                    |
| Database    | MongoDB, Mongoose                   |
| Auth        | JWT + bcryptjs                      |
| Icons       | lucide-react                        |

---

## Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB (local or MongoDB Atlas)

### 1. Backend Setup

```bash
cd server
cp .env.example .env       # Edit with your MongoDB URI & JWT secret
npm install
npm run seed               # Load demo data
npm run dev                # Start server on port 5000
```

### 2. Frontend Setup

```bash
npm install
npm run dev                # Start Vite dev server on port 5173
npm run build              # Production build
```

---

## Demo Login Credentials

| Role    | Email                       | Password      |
|---------|-----------------------------|---------------|
| Admin   | admin@studyvision.com       | password123   |
| Teacher | shashank@studyvision.com    | password123   |
| Student | student@studyvision.com     | password123   |
| Parent  | parent@studyvision.com      | password123   |

---

## API Endpoints

### Auth
| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| POST   | `/api/auth/login`     | Login                 |
| POST   | `/api/auth/register`  | Register              |
| GET    | `/api/auth/me`        | Get current user      |

### People
| Method | Endpoint                          | Access          |
|--------|-----------------------------------|-----------------|
| GET    | `/api/people/students`            | Authenticated   |
| POST   | `/api/people/students`            | Admin           |
| PUT    | `/api/people/students/:id`        | Admin           |
| DELETE | `/api/people/students/:id`        | Admin           |
| GET    | `/api/people/teachers`            | Authenticated   |
| POST   | `/api/people/teachers`            | Admin           |
| GET    | `/api/people/parents`             | Authenticated   |

### Academic
| Method | Endpoint                  | Access          |
|--------|---------------------------|-----------------|
| GET    | `/api/academic/classes`   | Authenticated   |
| POST   | `/api/academic/classes`   | Admin           |
| GET    | `/api/academic/courses`   | Authenticated   |
| POST   | `/api/academic/courses`   | Admin           |
| GET    | `/api/academic/batches`   | Authenticated   |
| POST   | `/api/academic/batches`   | Admin           |

### Attendance, Fees, Notes, Tests, Homework, Timetable, Notices, Enquiries, Content, Reports
All under `/api/` — see route files in `server/routes/` for full details.

---

## License
MIT
