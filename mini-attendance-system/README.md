# Mini Attendance System

This repo provides a mini attendance system with Auth, Attendance, and Report Worker services.

Quick start (using Docker Compose):

1. Build and start backend:

```
cd mini-attendance-system
docker-compose up --build

```

Start frontend:

```
cd frontend
npm install
npm run dev
```

2. Endpoints:

- Auth: http://localhost:4001
  - Swagger UI: http://localhost:4001/docs
- Attendance: http://localhost:4002
  - Swagger UI: http://localhost:4002/docs
- Report Worker: http://localhost:4003
- Health (example): http://localhost:4003/health

3. Postman collection is available at `backend/postman_collection.json`.
