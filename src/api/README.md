# Backend Documentation

This document covers the internal structure, technologies, and development guidelines for the Email Sender Service backend

### ⚙️ Tech Stack

- **Language** → Node.js + Typescript
- **Framework** → Express.js
- **Database** → MongoDB with Mongoose ODM
- **Authentication** → JWT (users) + API-Key (client access)
- **Job Queueing** → BullMQ + ioredis
- **Email Provider** → Mailtrap
- **Logging** → Winston + ExpressWinston
- **Input Validation** → Zod (schemas) + Validator (low-level) + Luxon (date handling)

