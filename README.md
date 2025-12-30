# School Management System (SMS)

A comprehensive microservices-based School Management System for Indian schools (Classes 1-12).

## Architecture

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Java Spring Boot Microservices
- **Database**: PostgreSQL (Multi-tenant, Schema-per-tenant)
- **API Gateway**: Spring Cloud Gateway
- **Authentication**: JWT-based authentication

## Project Structure

```
SMS-Project/
├── backend/
│   ├── api-gateway/          # Spring Cloud Gateway (Port: 8080)
│   ├── auth-service/         # Authentication Service (Port: 8081)
│   ├── user-service/         # User Management (Port: 8082)
│   ├── academic-service/     # Academic Management (Port: 8083)
│   ├── student-service/      # Student Management (Port: 8084)
│   ├── finance-service/      # Fee Collection (Port: 8085)
│   ├── exam-service/         # Examination (Port: 8086)
│   ├── hr-service/           # Human Resource (Port: 8087)
│   ├── content-service/      # Download Center (Port: 8088)
│   ├── communication-service/# Notice Board (Port: 8089)
│   └── transport-service/    # Transport (Port: 8090)
├── frontend/                 # React Dashboard
├── database/                 # Database scripts
└── docker/                   # Docker configurations

```

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Maven 3.8+

### Backend Setup
```bash
cd backend/student-service
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 8080 | Main entry point |
| Auth Service | 8081 | Authentication & JWT |
| User Service | 8082 | User Management |
| Academic Service | 8083 | Class, Subject, Tests |
| Student Service | 8084 | Student Information |
| Finance Service | 8085 | Fee Collection |
| Exam Service | 8086 | Marks & Report Cards |
| HR Service | 8087 | Staff Management |
| Content Service | 8088 | Study Materials |
| Communication Service | 8089 | Notices |
| Transport Service | 8090 | Routes & Vehicles |

## Documentation

- [Implementation Plan](../brain/implementation_plan.md)
- [Database Schema](./database/schema.sql)

## License

Proprietary - All rights reserved
