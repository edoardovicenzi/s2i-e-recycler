import express, { Router } from "express";
import { unitOfWorkMiddleware } from "../middlewares/unitofwork";
import { UnitOfWork } from "../dataAccessLayer/UnitOfWork";
import type { Category } from "../dataAccessLayer/CategoryRepository";
import { authenticateUser } from "../middlewares/authentication";

export const router: Router = express.Router();

router.use(unitOfWorkMiddleware);
router.use(authenticateUser);

router.get("/", async (req, res) =>{
    try{
        const uow = (req as any).uow as UnitOfWork;

        const categories: Category[] = await uow.categories.getAll();

        if (categories.length === 0){
            res.sendStatus(404);
        }

        res.status(200).json(categories);

    }
    catch (err){
        console.error(err);
        res.sendStatus(500);
    }
})

router.get("/:id", async (req, res) =>{
    try{

        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.sendStatus(400);
        }

        const uow = (req as any).uow as UnitOfWork;

        const category: Category = await uow.categories.getById(id);

        res.status(200).json(category);

    }
    catch (err){
        console.error(err);
        res.sendStatus(500);
    }
})
