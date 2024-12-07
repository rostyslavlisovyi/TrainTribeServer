import {Response} from "express";

const handleError = (
    res: Response,
    error: unknown,
    message = "INTERNAL SERVER ERROR"
): void => {
    console.error(error);
    res.status(500).json({ message });
};

module.exports = {
    handleError,
};
