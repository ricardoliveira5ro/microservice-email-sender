import { MailtrapClient, SendResponse } from "mailtrap";

import config from "../config/config";

export default function sendEmail(recipients: [], subject: string, text: string, category: string): Promise<SendResponse> {
    const client = new MailtrapClient({ token: config.mailtrapToken });

    const sender = {
        email: "info@email-sender.solutions",
        name: "Email Sender Solutions",
    };

    return client.send({
        from: sender,
        to: recipients,
        subject: subject,
        text: text,
        category: category,
    });
};