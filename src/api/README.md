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

### 📁 Project Structure

```
📁 api/
├── 📂 config/              # Environment configuration keys
├── 📂 db/                  # MongoDB connection setup
├── 📂 middlewares/         # Middleware handlers
├── 📂 models/              # Mongoose schemas and types
├── 📂 queue/               # Queue connection setup
├── 📂 routes/              # API endpoints  
├── 📂 services/            # Business logic
├── 📂 utils/               # Helper functions
│   ├── 📂 emails/          # Email templates
│   ├── 📂 errors/          # Custom error classes
│   ├── 📂 logs/            # Winston formatters, transports, and sanitizers
│   └── 📄 functions.ts     # Reusable utility functions
├── 📂 validators/          # Zod input schemas validators
├── 📂 workers/             # BullMQ workers for email processing
├── 📄 app.ts               # Express app setup  
└── 📄 server.ts            # Server entry point 
```

### 🔑 Authentication Flow

- User Authentication
    - Login/registration returns a JWT
    - This JWT is transformed into **two secure cookies** sent to the client (signature cookie is `HTTP-only`)
    - Login requires a valid reCAPTCHA
    - Used to manage API keys and user account.

- API Key Auth
    - Used to authenticate requests to emails/ endpoints.
    - Keys can be scoped to read or write.