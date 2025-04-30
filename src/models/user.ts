import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

import { AppError } from "../middlewares/errorHandler";

interface IUser {
    username: string;
    email: string;
    password: string;
};

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
}, {
    timestamps: true
});

// Bind relationship w/ ApiKey
userSchema.virtual('apiKey', {
    ref: 'ApiKey',
    localField: '_id',
    foreignField: 'user'
});

userSchema.pre('save', async function (): Promise<void> {
    if (this.password && this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
})

userSchema.statics.authenticate = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        const error = new Error('Unable to login') as AppError;
        error.status = 401;
        throw error;
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        const error = new Error('Unable to login') as AppError;
        error.status = 401;
        throw error;
    }

    return user
}

userSchema.methods.toJSON = function () {
    const userStatsObject = this.toObject()

    delete userStatsObject._id
    delete userStatsObject.password
    delete userStatsObject.createdAt
    delete userStatsObject.updatedAt
    delete userStatsObject.__v

    return userStatsObject
}

const User = model<IUser>('User', userSchema);

export default User;