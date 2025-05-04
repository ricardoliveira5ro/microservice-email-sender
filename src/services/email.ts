import { MailtrapClient } from "mailtrap";

import config from "../config/config";

export default function sendEmail(): void {
    const client = new MailtrapClient({
        token: config.mailtrapToken,
        sandbox: true,
        testInboxId: 3666623,
    });

    const sender = {
        email: "test@demomailtrap.co",
        name: "Mailtrap Test",
    };

    const recipients = [
        {
          email: "someone@gmail.com",
        },
    ];

    client
        .send({
            from: sender,
            to: recipients,
            subject: "You are awesome!",
            text: "Congrats for sending test email with Mailtrap!",
            category: "Integration Test",
        })
        .then(console.log, console.error);
};