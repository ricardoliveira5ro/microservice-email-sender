import { NextFunction, Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';

import AppError from '../utils/errors/AppError';
import config from '../config/config';

const developmentError = (err: Error, res: Response): void => {
    res.status((err instanceof AppError) ? err.status : 500).send({
        message: err.message,
        stack: err.stack,
    });
};

const productionError = (err: Error, res: Response): void => {
    if (err instanceof AppError && err.isOperational) {
        res.status(err.status).send({
            message: err.message,
        });

    } else {
        res.status(500).send({
            message: "Something went wrong!",
        });
    }
};

const databaseError = (err: MongoServerError): AppError => {
    // Unique index
    if (err.code === 11000) {
        const [field, value] = Object.entries(err.keyValue as string)[0];
        const message = `Field '${field}' with value '${value}' already exists`;

        return new AppError (message, 400);
    }

    return new AppError (err.message, 400);
};

const validationError = (err: MongooseError.ValidationError): AppError => {
    const errors = Object.values(err.errors).map(e => e.message);
    const message = `Invalid data. ${errors.join(". ")}`;

    return new AppError (message, 400);
};

const requestValidationError = (err: ZodError): AppError => {
    const message = err.errors.map(e => `${e.path[0].toString()}: ${e.message}`)
                                .join(' -- && -- ');

    return new AppError (message, 400);
};

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof MongoServerError) err = databaseError(err);
    if (err instanceof MongooseError.ValidationError) err = validationError(err);
    if (err instanceof ZodError) err = requestValidationError(err);

    if (config.nodeEnv === "development") {
        developmentError(err, res);

    } else if (config.nodeEnv === "production") {
        productionError(err, res);
    }
};