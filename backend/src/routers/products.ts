import express, { Router } from "express";

// Middlewares
import { unitOfWorkMiddleware } from "../middlewares/unitofwork";
import { authenticateUser } from "../middlewares/authentication";

// Utility
import { UnitOfWork } from "../dataAccessLayer/UnitOfWork";
import type { User } from "../dataAccessLayer/UserRepository";
import type { Product } from "../dataAccessLayer/ProductRepository";
import { isProduct } from "../utility/functions";

export const router: Router = express.Router();

router.use(unitOfWorkMiddleware);
router.use(authenticateUser);

router.post("/", async (req, res) =>{
    try {
        const uow = (req as any).uow as UnitOfWork;
        const body = req.body;

        //Automatically populate the user id taken from authentication
        const user: User = {
            id: (req as any).user.id,
        }
        body.user = user;

        if(!isProduct(body)){
            res.sendStatus(400);
        }

        await uow.products.add(body);
        res.sendStatus(200)
    }
    catch (err){
        console.error(err);
        res.sendStatus(500);
    }
})


router.get("/", async (req, res) =>{
    try{

        const uow = (req as any).uow as UnitOfWork;

        const products: Product[] = await uow.products.getAll();

        res.status(200).json(products);

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

        const product: Product = await uow.products.getById(id);

        res.status(200).json(product);

    }
    catch (err){
        console.error(err);
        res.sendStatus(500);
    }
})
//specific props
router.get("/:id/:prop", async (req, res) =>{
    try{

        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.sendStatus(400);
        }

        const uow = (req as any).uow as UnitOfWork;

        const product: Product = await uow.products.getById(id);

        if ((product as any)[req.params.prop]){
            res.status(200).json((product as any)[req.params.prop]);
        }
        else{
            res.sendStatus(404);
        }


    }
    catch (err){
        console.error(err);
        res.sendStatus(500);
    }
})

router.put("/:id", async (req, res) =>{
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.sendStatus(400);
        }

        const uow = (req as any).uow as UnitOfWork;
        const body = req.body;

        //Automatically populate the user id taken from authentication
        const user: User = {
            id: (req as any).user.id,
        }
        body.user = user;

        if(!isProduct(body)){
            res.sendStatus(400);
            return;
        }

        const product: Product = await uow.products.getById(id);

        //only the owner of the product should be able to update it
        console.log("Comparing ids ...", product.user.id, " - ", (req as any).user.id);
        if (product.user.id !== (req as any).user.id) {
            res.sendStatus(403);
            return;
        }

        await uow.products.update(body);
        res.sendStatus(200);
    }
    catch (err){
        console.error(err);
        res.sendStatus(500);
    }

})

router.delete("/:id" , async (req, res) =>{
    try{

        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        const uow = (req as any).uow as UnitOfWork;

        const product: Product = await uow.products.getById(id);

        if (!product){
            res.sendStatus(404);
            return;
        }

        //only the owner of the product should be able to remove it
        if (!(product.user.id === (req as any).user.id)){
            res.sendStatus(403);
            return;
        }

        await uow.products.deleteById(id);

        res.sendStatus(200);

    }
    catch (err){
        console.error(err);
        res.sendStatus(500);
    }

})
