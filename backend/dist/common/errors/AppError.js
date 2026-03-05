export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = 'Not authorized') {
        super(message, 401);
    }
}
export class ForbiddenError extends AppError {
    constructor(message = 'Permission denied') {
        super(message, 403);
    }
}
