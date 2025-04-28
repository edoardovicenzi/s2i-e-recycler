import jwt from "jsonwebtoken";
import type { User } from "../types/types";
import { NextFunction, Request, Response } from "express";

const EXPIRATION_TIME = "1m"

export function generateAccessToken(user: User): string {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: EXPIRATION_TIME });
}

export function generateRefreshToken(user: User): string {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

//express js middlewares
export function authenticateUser(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.body.user = user;
        next();
    })

}
