# API Documentation

All the calls to the API should be using this instance `https://email-sender.solutions/api`

### ⚕️ Health Check

`GET /health`

Should get a `200 OK` response like this:

```
{
    "uptime": 1463.950320013,
    "message": "OK",
    "timeStamp": 1749757528915
}
```

### 📤 Sending Emails

`POST /emails/send-email?authId=[YOUR_AUTH_ID]&key=[YOUR_API_KEY]`

Request body:

```
{
    "recipients": [
        {
            "email": "[some recipient]"
        }
    ],
    "subject": "Testing",
    "text": "This is a test email",
    "category": "Testing",
    "scheduledAt": "2025-05-18T15:01:30+01:00" //optional & with explicit timezone
}
```

### 📡 Email Status

`GET /emails/status/[EMAIL_ID]?authId=[YOUR_AUTH_ID]&key=[YOUR_API_KEY]`

Should get a `200 OK` response like this:

```
{
    "_id": "[EMAIL_ID]",
    "status": "delivery",
    "lastUpdateTime": "2025-06-13T13:12:53.000Z",
    "bounceCategory": "N.A.",
    "response": "N.A.",
    "reason": "N.A."
}
```

### 🔎 Query Emails

`GET /emails/status/all?authId=[YOUR_AUTH_ID]&key=[YOUR_API_KEY]`

There are other query parameters to restrict the number of results:

- `status`: 'delivery', 'bounce', 'suspension', 'unsubscribe', 'open', 'spam', 'click', 'reject'
- `subject`: Filter by subject keyword
- `recipient`: Filter by recipient email
- `page`: Page number
- `size`: Items per page (default: 10)

Should get a `200 OK` response with an array of emails: