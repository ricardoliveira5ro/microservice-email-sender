# Backend Documentation

This document covers the internal structure, technologies, and development guidelines for the **Email Sender Service** backend

### ⚙️ Tech Stack

- **Language** → Node.js + Typescript
- **Framework** → Express.js
- **Database** → MongoDB with Mongoose ODM
- **Authentication** → JWT (users) + API-Key (client access)
- **Job Queueing** → BullMQ + ioredis
- **Email Provider** → Mailtrap
- **Logging** → Winston + ExpressWinston
- **Input Validation** → Zod (schemas) + Validator (low-level) + Luxon (date handling)
- **Rate Limiting** → express-rate-limit

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
├── 📂 validators/          # Zod input schema validators
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

### 📬 Email Flow

1. Incoming Request to /emails/send-email
2. Auth Middleware checks `authId` + `key` and its permissions
3. Validation request body
4. Add email to job queue
5. Service either sends immediately or schedules
6. Email Status is tracked and stored in database

### 🗂️ Models

- **User**: Stores username, email, password hash and tokens.
- **APIKey**: Stores generated keys, permission scopes, and status
- **Email**: Stores sender, email content, recipients, subject, category, delivery status and Mailtrap payload.

### 🛡️ Middlewares

- `apiKeyAuthorizationMiddleware`: Validates API Key and permission scope
- `jwtMiddleware`: Reconstructs cookies into auth token and sets it as authorization request header
- `authMiddleware`: Decodes and verifies the token to identify the user
- `errorHandler`: Centralized error processor that formats, maps, and handles known errors based on environment and type
- `resetMiddleware`: Decode reset-token from database to verify its authenticity
- `applicationLogger` & `httpLogger`: Application and route logger
- `reCaptchaMiddleware`: Validates reCAPTCHA value
- `limiter`: Rate Limiter

### 📃 Logging

The application uses Winston for structured logging across all environments.

- Logs are written to the console and directly streamed to a file in an AWS S3 bucket
- Log entries are batched and flushed every 60 seconds

### 🚀 Deployment

- The server handles both API endpoints and serves the frontend static build
- **Database** → MongoDB Atlas
- **App Hosting** → Render
- **Queue & Jobs** → Redis Cloud (used with BullMQ)