import { Document, Schema, Model, model } from "mongoose";
import bcrypt from "bcrypt";
import { isEmail, isStrongPassword } from "validator";

import AppError from "../utils/errors/AppError";

export interface IUser {
    username: string;
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpiration: Date;
};

interface IUserModel extends Model<IUser> {
    authenticate(email: string, password: string): Promise<Document & IUser>;
};

const userSchema = new Schema<IUser, IUserModel>({
    username: { 
        type: String, 
        unique: true, 
        required: true,
        trim: true,
    },
    email: { 
        type: String, 
        unique: true, 
        required: true, 
        trim: true,
        validate: {
            validator: (value): boolean => isEmail(value as string),
            message: 'Email is invalid',
        },
    },
    password: { 
        type: String, 
        required: true,
        trim: true,
        validate: {
            validator: (value): boolean => isStrongPassword(value as string, { minLength: 7, minNumbers: 0, minLowercase: 0, minUppercase: 1, minSymbols: 1 }),
            message: 'Password is invalid',
        },
    },
    passwordResetToken: {
        type: String,
        required: false,
    },
    passwordResetExpiration: {
        type: Date,
        required: false,
    },
}, {
    timestamps: true,
});

// Bind relationship w/ ApiKey
userSchema.virtual('apiKeys', {
    ref: 'ApiKey',
    localField: '_id',
    foreignField: 'user',
});

userSchema.pre('save', async function (): Promise<void> {
    if (this.password && this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }

    if (this.passwordResetToken && this.isModified('passwordResetToken')) {
        this.passwordResetToken = await bcrypt.hash(this.passwordResetToken, 8);
    }
});

userSchema.static('authenticate', async function authenticate (email: string, password: string): Promise<Document & IUser> {
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError('Unable to login', 401);
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError('Unable to login', 401);
    }

    return user;
});

userSchema.methods.toJSON = function (this: Document & IUser): object {
    const { _id, username, email } = this.toObject() as Document & IUser;

    return { _id, username, email };
};

const User = model<IUser, IUserModel>('User', userSchema);

export default User;