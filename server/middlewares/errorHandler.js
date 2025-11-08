import { ApiError } from "../utils/ApiError";

const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";

    res.status(statusCode).json(new ApiError(
        statusCode, 
        message, 
        err.errors, 
        process.env.NODE_ENV === "development" ? err.stack : undefined
    ));
}

module.exports = {
    errorHandler,
}