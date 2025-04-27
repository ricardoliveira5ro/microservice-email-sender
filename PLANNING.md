### Overview

```
  [Client/API Request]
          |
          v
+---------------------+
|    Email API        |
|  - Auth             |
|  - Validation       |
|  - Queues email     |
+---------------------+
          |
          v
   [Message Queue]
  (RabbitMQ / Redis)
          |
          v
+-------------------------+
|   Email Worker Service  |
|  - Listens to queue     |
|  - Sends email (API)    |
|  - Logs result          |
+-------------------------+
          |
          v
     [ Database ]
Store status: success, fail, retry
```
<br>

### Concepts

- Queueing: Async job handling via Redis (BullMQ) or RabbitMQ
- Microservices: Decoupling API and Worker
- Retries + Fail Handling
- Observability: Logging, tracking delivery status
- Docker: Containerize each part for dev and prod
- Scalability: You can scale the worker service independently

### Tech Stack

| Component     | Tech         |
|---------------|--------------|
| API           | Node/Express |
| Queue         | Redis + BullMQ (or RabbitMQ + amqplib) |
| Email Service | Resend / Nodemailer (SMTP) |
| Database      | PostgreSQL / MongoDB |
| Deployment    | Render / Koyeb + Docker |

### Features

- API key-based auth
- Webhook for "delivered" or "failed" status
- Retry failed emails up to 3 times
- Admin dashboard (logs) (basic UI or CLI)
- Queue priority
- Email templates