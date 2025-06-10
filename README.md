# Email Sender

Secure and scalable RESTful API for sending and managing emails. The service is built to support real-time and scheduled email delivery, with robust filtering and permission-based access control. 
This API is ideal for integrating email functionality into your application, whether it's for sending transactional emails, marketing campaigns, or scheduled notifications.

🌐 The application is live and available [here](https://email-sender.solutions/)

> [!WARNING]
> The first request/access may take up to 60 seconds due to tier restrictions. (Subsequent requests will be normalized)
<br/>

### ⚡ Features

- **User Authentication**: Secure registration and login system with token-based authentication.
- **API Key Management**: Generate, revoke, and manage API Keys with read-write permissions 
- **Send or Schedule Emails**: Instantly send emails or schedule them for a future time
- **Email Tracking**: Inspect the status of individual emails.
- **Advanced Filtering**: Retrieve a list of email requests with filters for:
    - Status
    - Subject
    - Recipient email address
    - Pagination support with page and size parameters