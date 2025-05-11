import { MailtrapClient } from "mailtrap";

import config from "../config/config";

export default function sendEmail(recipients: [], subject: string, text: string, category: string): void {
    const client = new MailtrapClient({ token: config.mailtrapToken });

    const sender = {
        email: "info@email-sender.solutions",
        name: "Email Sender Solutions",
    };

    client
        .send({
            from: sender,
            to: recipients,
            subject: subject,
            text: text,
            category: category,
        })
        .then(console.log, console.error);
};