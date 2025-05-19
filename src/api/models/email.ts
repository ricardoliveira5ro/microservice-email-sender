import { Document, Schema, Types, model } from "mongoose";

export interface IEmail {
    sender: Types.ObjectId;
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
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    recipients: [{
        email: { type: String, required: true },
    }],
    subject: { type: String, required: true },
    text: { type: String, required: true },
    category: { type: String, required: true },
    messageId: { type: String },
    status: { type: String, enum: ['delivery', 'bounce', 'suspension', 'unsubscribe', 'open', 'spam', 'click', 'reject'] },
    eventId: { type: String },
    timestamp: { type: Number },
    bounceCategory: { type: String },
    response: { type: String },
    reason: { type: String },
    userAgent: { type: String },
}, {
    timestamps: true,
});

emailSchema.methods.toJSON = function (this: Document & IEmail): object {
    const { _id, status, timestamp, bounceCategory, response, reason } = this.toObject() as Document & IEmail;

    return {
        _id,
        status,
        lastUpdateTime: timestamp ? new Date(timestamp * 1000).toISOString() : new Date().toISOString(),
        bounceCategory: bounceCategory || 'N.A.',
        response: response || 'N.A.',
        reason: reason || 'N.A.',
    };
};

const Email = model<IEmail>('Email', emailSchema);

export default Email;