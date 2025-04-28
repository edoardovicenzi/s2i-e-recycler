import express from "express";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";


import { Roles, type User } from "./types/types";
import { authenticateUser, generateAccessToken, generateRefreshToken } from "./jwt/functions";
import { TokenRepository } from "./database/TokenRepository";
import { DatabaseConnection } from "./database/DatabaseConnection";



//Pre-init
dotenv.config();

//init
const PORT = process.env.PORT
const app = express();
const dbTokens: TokenRepository = new TokenRepository();

app.use(express.json())


app.get("/ready", (_, res) => {
    res.sendStatus(200);
})


app.post("/login", (req, res) => {
    if (!req.body || !req.body.userId || !req.body.role) {
        res.sendStatus(400);
    }
    try {
        const user: User = {
            userId: req.body.userId,
            role: req.body.role,
        }

        const authToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        dbTokens.add(refreshToken);

        res.status(200).json({ authToken: authToken, refreshToken: refreshToken });

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

})

//Here we delete the refresh token only for an authenticated user
app.delete("/logout", authenticateUser, (req, res) => {

    console.log(`Deletetion request from user ${req.body.user.userId} with role of ${req.body.user.role}...`)
    // only admin should use this endpoint
    if (req.body.user.role !== Roles.ADMIN) {
        res.sendStatus(403);
    }

    //body must contain a token
    if (!req.body.token) {
        res.sendStatus(400);
    }

    try {
        dbTokens.deleteByString(req.body.token)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    res.sendStatus(204);
})


app.post("/token", (req, res) => {
    if (!req.body || !req.body.token) {
        res.sendStatus(401);
    }
    const token: string = req.body.token;
    //TODO: regenerate access token

    //Check if token exists in db
    //TODO: Continua qui!
    console.log(dbTokens.getByString(token))

    //Decode token
    const decodedUser: JwtPayload | null = jwt.decode(token, { json: true });
    const user: User = {
        userId: decodedUser.userId,
        role: decodedUser.role
    }

    //create new access token
    const newAccessToken = generateAccessToken(user);

    //send response
    res.status(200).json({
        token: newAccessToken
    });
})

// Start server
app.listen(PORT, () => {
    console.log(`Auth server listening to port ${PORT}`)
})
