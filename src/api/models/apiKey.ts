import { Document, Schema, Types, model } from "mongoose";
import bcrypt from "bcrypt";

import { lastUsageConverter } from "../utils/functions";

interface IApiKey {
    name: string;
    key: string;
    permission: string;
    isActive: boolean;
    lastUsage?: Date;
    user: Types.ObjectId;
};

const apiKeySchema = new Schema<IApiKey>({
    name: { type: String },
    key: { type: String },
    permission: { type: String, enum: ["READ", "WRITE"], default: "READ" },
    isActive: { type: Boolean, default: true },
    lastUsage: { type: Date, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

apiKeySchema.pre('save', async function(): Promise<void> {
    if (this.key && this.isModified('key')) {
        this.key = await bcrypt.hash(this.key, 8);
    }
});

apiKeySchema.methods.toJSON = function (this: Document & IApiKey): object {
    const { _id, name, isActive, user, lastUsage, createdAt } = this.toObject() as Document & IApiKey & { createdAt: Date };
    
    return { 
        _id,
        name,
        isActive, 
        user,
        lastUsage: lastUsageConverter(lastUsage),
        createdAt: createdAt.toISOString().split('T')[0],
    };
};

const ApiKey = model<IApiKey>('ApiKey', apiKeySchema);

export default ApiKey;