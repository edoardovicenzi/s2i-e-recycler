import bcrypt from "bcrypt";

const BCRYPT_SALT_ROUNDS = 10;

export async function generateHash(password: string): Promise<string> {
    try{
        return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    }
    catch (err){
        console.error(`[BCRYPT] Error generating password: ${err}`);
        throw err
    }
}

export async function comparePasswords(client: string, server:string ): Promise<boolean> {
    try{
        return await bcrypt.compare(client, server)
    }
    catch (err){
        console.error(`[BCRYPT] Error comparing password: ${err}`);
        throw err
    }
}
