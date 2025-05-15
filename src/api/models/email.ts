import { Document, Schema, model } from "mongoose";

export interface IEmail {
    recipients: { email: string }[];
    subject: string;
    text: string;
    category: string;
    // --- Mailtrap payload --- //
    status: string;
    messageId: string;
    eventId: string;
    timestamp: number;
    bounceCategory: string;
    response: string;
    reason: string;
    userAgent: string;
};

const emailSchema = new Schema<IEmail>({
    recipients: [{
        email: { type: String, required: true },
    }],
    subject: { type: String, required: true },
    text: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: ['delivery', 'bounce', 'suspension', 'unsubscribe', 'open', 'spam', 'click', 'reject'], required: true },
    messageId: { type: String, required: true },
    eventId: { type: String, required: true },
    timestamp: { type: Number, required: true },
    bounceCategory: { type: String },
    response: { type: String },
    reason: { type: String },
    userAgent: { type: String },
}, {
    timestamps: true,
});

emailSchema.methods.toJSON = function (this: Document & IEmail): object {
    const { _id, recipients, subject, text, category, status, messageId, eventId, timestamp, bounceCategory, response, reason, userAgent } = this.toObject() as Document & IEmail;

    return { _id, recipients, subject, text, category, status, messageId, eventId, timestamp, bounceCategory, response, reason, userAgent };
};

const Email = model<IEmail>('Email', emailSchema);

export default Email;