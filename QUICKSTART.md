# Quick Start Guide - School Management System

## Setup Instructions

### 1. Database Setup

```bash
# Start PostgreSQL (if not already running)
# Create database
psql -U postgres -c "CREATE DATABASE sms_db;"

# Run schema
psql -U postgres -d sms_db -f database/schema.sql
```

### 2. Backend Setup

```bash
cd backend/student-service
mvn clean install
mvn spring-boot:run
```

Backend will be available at: `http://localhost:8084`
Swagger UI: `http://localhost:8084/swagger-ui.html`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## Quick Test

1. Open browser to `http://localhost:5173`
2. Click **Student Information** → **Add Student** in sidebar
3. Fill in student details and click **Save Student**
4. View the student in the **Student List**

## API Documentation

Access Swagger UI at: `http://localhost:8084/swagger-ui.html`

Test endpoints:
- `GET /api/v1/students` - List students
- `POST /api/v1/students` - Create student
- `POST /api/v1/students/promote` - Promote students

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify database credentials in `application.properties`
- Ensure port 8084 is available

### Frontend won't start
- Run `npm install` again
- Check Node.js version (18+)
- Ensure port 5173 is available

### CORS errors
- Verify backend is running
- Check CORS settings in `application.properties`
- Frontend should be on `http://localhost:5173`
