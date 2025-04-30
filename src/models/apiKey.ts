import { Schema, Types, model } from "mongoose";
import bcrypt from "bcrypt";

interface IApiKey {
    key: string;
    isActive: boolean;
    user: Types.ObjectId;
};

const apiKeySchema = new Schema<IApiKey>({
    key: { type: String },
    isActive: { type: Boolean, default: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

apiKeySchema.pre('save', async function(): Promise<void> {
    if (this.key && this.isModified('key')) {
        this.key = await bcrypt.hash(this.key, 8);
    }
});

apiKeySchema.methods.toJSON = function () {
    const userStatsObject = this.toObject();

    delete userStatsObject._id;
    delete userStatsObject.key;
    delete userStatsObject.createdAt;
    delete userStatsObject.updatedAt;
    delete userStatsObject.__v;

    return userStatsObject;
}

const ApiKey = model<IApiKey>('ApiKey', apiKeySchema);

export default ApiKey;