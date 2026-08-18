# EventPulse - Event Management Backend API

EventPulse is a comprehensive, production-ready Event Management Backend API built with Node.js, Express, MongoDB (Mongoose), Socket.io, and Swagger UI.

## Features
- **MVC Architecture**: Strict separation of concerns (Models, Controllers, Routes, Middleware, Utils, Config).
- **Authentication & Authorization**: JWT-based auth with bcrypt hashing and Role-Based Access Control (`admin` vs `attendee`).
- **Events Management**: Advanced query filters (category, city, date range), pagination, sorting (date, popularity), and full-text search.
- **Capacity Management**: Automatic event registration enforcement, capacity limits, duplicate registration prevention, and space release on cancellation.
- **Real-Time Broadcasting**: Socket.io live announcement rooms with database message persistence for historical catchup.
- **Input Validation**: Express-Validator on all POST/PATCH endpoints with structured HTTP 422 error outputs.
- **Centralized Error Handling**: Custom `AppError` class, `asyncHandler` wrapper, and central error middleware.
- **Automated Testing**: Comprehensive unit tests for utilities and integration tests using Jest and Supertest.
- **Interactive Documentation**: Swagger UI at `/api-docs` and Postman Collection with Shared Environment.
- **Deployment Ready**: Native Vercel deployment configuration with MongoDB Atlas support.

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your connection details:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Database Seeding
Populate the database with sample categories, events, and an admin user:
```bash
npm run seed
```

### 4. Running the App
Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### 5. Running Tests
```bash
npm test
```

## Interactive Swagger Documentation
Access the interactive Swagger UI at:
`http://localhost:5000/api-docs`

## Health Check Endpoint
Check server & database availability at:
`http://localhost:5000/health`
