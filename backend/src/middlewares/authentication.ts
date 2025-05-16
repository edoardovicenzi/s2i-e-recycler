import { Request, Response, NextFunction } from "express";

export async function authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void> {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token){
        res.sendStatus(401);
    }

    const newHeaders: Headers = new Headers();
    newHeaders.append(`Authorization`, `Bearer ${token}`);

    const authRequest: RequestInit = {
        method : "POST",
        headers: newHeaders,
    }

    console.log("Authenticating user...");
    const response = await fetch(process.env.AUTH_SERVICE_URL + "/auth", authRequest);

    if (!(response.status >= 200 && response.status < 400)){
        console.log("Authentication failed with status: ", response.status);
        res.sendStatus(response.status);
        return;
    }

    const content = await response.json();

    console.log("Authenticated successfully: ", content);
    (req as any).user = {
        id: content.userId,
        role: content.role,
    }
    next();
}
