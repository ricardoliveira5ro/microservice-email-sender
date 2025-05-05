export default class AppError extends Error {
    status: number;
    isOperational: boolean;

    constructor (public message: string, status: number, isOperational = true) {
        super(message);
        this.status = status;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, AppError.prototype);
    };
}