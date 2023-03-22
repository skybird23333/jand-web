import express from "express";

export function apiError(req: express.Request, res: express.Response, statusCode: number, message: string) {
    res.status(statusCode).send({
        "error": statusCode,
        "message": message
    });
}