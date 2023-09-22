class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode;
    }
}



export const errorMiddleWare = (err, req, res, next) => {

    err.message = err.message || "Internal server error";
    err.status = err.status || 500;

    return res.status(err.status).json({
        success: false,
        message: err.message,
    })
}

export default ErrorHandler;