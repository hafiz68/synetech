Endpoints

Send Email
Endpoint: POST /api/send-email

Description: Send an email using Mailgun API.

Request Body:

json
{
  "to": "recipient@example.com",
  "subject": "Hello from Mailgun Integration",
  "text": "This is the plain text content of the email.",
  "html": "<p>This is the HTML content of the email.</p>"
}
Response:
{
  "message": "Email sent successfully",
  "data": {
    "id": "mailgun_message_id",
    "recipient": "recipient@example.com",
    "subject": "Hello from Mailgun Integration"
  }
}


Webhook for Incoming Email Replies
Endpoint: POST /api/receive-email-webhook

Description: Handle incoming email replies sent to the configured Mailgun webhook.
Response:
{
  "message": "Webhook received and processed successfully",
  "data": {
    "event": "opened",
    "recipient": "your_mailgun_webhook_recipient@example.com",
    "subject": "Re: Hello from Mailgun Integration",
    "message-id": "mailgun_message_id"
  }
}