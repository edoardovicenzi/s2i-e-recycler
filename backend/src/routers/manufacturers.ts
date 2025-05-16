import express, { Router } from "express";

// Utility 
import type { Manufacturer } from "../dataAccessLayer/ManufacturerRepository";
import { UnitOfWork } from "../dataAccessLayer/UnitOfWork";

// Middlewares
import { authenticateUser } from "../middlewares/authentication";
import { unitOfWorkMiddleware } from "../middlewares/unitofwork";

export const router: Router = express.Router();

router.use(unitOfWorkMiddleware);
router.use(authenticateUser);

router.get("/", authenticateUser, async (req, res) =>{
    try{
        const uow = (req as any).uow as UnitOfWork;

        const manufacturers: Manufacturer[] = await uow.manufacturers.getAll();

        if (manufacturers.length === 0){
            res.sendStatus(404);
        }

        res.status(200).json(manufacturers);

    }
    catch (err){
        console.error(err);
        res.sendStatus(500);
    }
})

router.get("/:id", authenticateUser, async (req, res) =>{
    try{

        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.sendStatus(400);
        }

        const uow = (req as any).uow as UnitOfWork;

        const manufacturer: Manufacturer = await uow.manufacturers.getById(id);

        res.status(200).json(manufacturer);

    }
    catch (err){
        console.error(err);
        res.sendStatus(500);
    }
})
