import express from "express";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";


import type { User } from "./types/types";
import { generateAccessToken, generateRefreshToken } from "./jwt/functions";
import { TokenRepository } from "./database/TokenRepository";



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
app.delete("/logout", (req, res) => {

    //body must contain a token
    if (!req.body.token) {
        res.sendStatus(400);
    }

    try {
        dbTokens.deleteByString(req.body.token)
        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})


app.post("/token", async (req, res) => {
    try{
        if (!req.body || !req.body.token) {
            res.sendStatus(401);
        }
        const token: string = req.body.token;

        //Check if token exists in db
        const queryResults = await dbTokens.getByString(token)
        if (queryResults[0].length  === 0){
            res.sendStatus(401);
            return
        }

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
    }
    catch (error){
        console.log(error);
        res.sendStatus(500)
    }
})

app.post("/auth", async (req, res) => {
    try{
        const authHeader: string | undefined = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token){
            res.sendStatus(401);
            return;
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            res.status(200).json(user);
        })
    }
    catch (err){
        res.sendStatus(500)
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`Auth server listening to port ${PORT}`)
})
