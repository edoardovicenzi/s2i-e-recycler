import { Request, Response, NextFunction } from "express";
import { UnitOfWork } from "../dataAccessLayer/UnitOfWork";

export async function unitOfWorkMiddleware(req: Request, res: Response, next: NextFunction){
    const uow = new UnitOfWork();
    await uow.start();

    //cast req to any so we can add uow property
    (req as any).uow = uow;

    //cleanup connection after handler finished

    res.on("finish", async () => {
        try{
            if (res.statusCode >= 200 && res.statusCode < 400){
                await uow.commit();
            }
            else{
                await uow.rollback();
            }
        }
        catch (err){
            console.error(`[UnitOfWorkMiddleware] Transaction commit/rollback error: ${err}`)
        }
    })

    next();
};
