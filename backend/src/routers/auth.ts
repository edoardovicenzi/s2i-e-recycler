import express, { Router } from "express";

// Middlewares
import { unitOfWorkMiddleware } from "../middlewares/unitofwork";

// Utility
import { UnitOfWork } from "../dataAccessLayer/UnitOfWork";
import type { User } from "../dataAccessLayer/UserRepository";
import { deleteToken, DeleteTokenRequest, getTokens, refreshToken, RefreshTokenRequest, RefreshTokenResponse, TokenRequest, TokenResponse } from "../utility/tokens";
import { comparePasswords, generateHash } from "../utility/password";
import { isUser } from "../utility/functions";
import type { Role } from "../types/types";

export const router: Router = express.Router();

router.use(unitOfWorkMiddleware);

//given a refresh token will answer with a valid auth token
router.post("/token", async (req, res) => {
    try {
        const uow = (req as any).uow as UnitOfWork;

        if(!req.body.token){
            res.sendStatus(400);
        }

        //2. Get jwt token from external service
        const tokenReq: RefreshTokenRequest = {
            token: req.body.token,
        }

        const token: RefreshTokenResponse = await refreshToken(tokenReq);

        res.status(200).json({
            authToken: token.token,
        });
    }
    catch (err){
        console.error(err);
        res.sendStatus(500);
    }

})

//given an email and password it will register a new user
//responds 409 if the user already exists
//email must be unique
router.post("/register", async (req , res) => {
    try {
        const uow = (req as any).uow as UnitOfWork;

        if(!req.body.email && !req.body.password){
            res.sendStatus(400);
        }

        //1. create user
        const newUser: User = {
            email: req.body.email,
            password: await generateHash(req.body.password)
        }

        const checkUser = await uow.users.getByEmail(newUser.email as string);

        if (checkUser){
            res.sendStatus(409);
        }

        const id = await uow.users.add(newUser);

        //2. Get jwt token from external service
        const tokenReq: TokenRequest = {
            userId: id,
            role: "user"
        }

        const tokens: TokenResponse = await getTokens(tokenReq);

        res.status(200).json(tokens)
    }
    catch (err){
        console.error(err);
        res.sendStatus(500);
    }

})

//given an email and password will generate both tokens anew
router.post("/recover", async (req , res) => {
    try{
        const uow = (req as any).uow as UnitOfWork;

        const body = req.body;

        if(!isUser(body)){
            res.sendStatus(400);
            return;
        }

        const email: string  = req.body.email;
        //1. check if there is an existing user with same email
        const existingUser: User = await uow.users.getByEmail(email);

        if (!existingUser){
            res.sendStatus(401);
            return;
        }

        //compare password hashes
        const passwordMatches: boolean = await comparePasswords(req.body.password, existingUser.password as string);
        if (!passwordMatches){
            //sending 401 instead of 403 so no information is disclosed on user wherabouts
            res.sendStatus(401);
            return;
        }


        //Get jwt token from external service
        const tokenReq: TokenRequest = {
            userId: existingUser.id as number,
            role: existingUser.role as Role
        }

        const tokens: TokenResponse = await getTokens(tokenReq);

        res.status(200).json(tokens);
    }
    catch (err){
        console.error(err);
        res.sendStatus(500);
    }

})

//Given a refresh token it will remove it from from the auth service
router.delete("/logout", async (req , res) => {
    try{
        if(!req.body.token){
            res.sendStatus(400);
        }

        const tokenReq: DeleteTokenRequest = {
            token: req.body.token
        }
        await deleteToken(tokenReq);
        res.sendStatus(200)
    }
    catch (err){
        console.error(err);
        res.sendStatus(500);
    }
})
