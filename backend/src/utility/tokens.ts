import type { Role } from "../types/types";

export interface TokenRequest {
    userId: number;
    role: Role;
}
export interface TokenResponse {
    authToken: string;
    refreshToken: string;
}

export async function getTokens(request: TokenRequest): Promise<TokenResponse> {
    try{
        const headers: Headers = new Headers();
        headers.append("Content-Type", "application/json");

        const response = await fetch(process.env.AUTH_SERVICE_URL + "/login", {
            headers: headers,
            method: "POST",
            body: JSON.stringify(request)
        })

        const data: TokenResponse = await response.json();
        if (response.status == 200){
            return data
        }
        else{

            throw new Error(`Unable to get tokens, status code ${response.status}`)
        }
    }
    catch (err){
        console.error(`[TOKENSERVICE] Err getting tokens: ${err}`)
        throw err
    }

}



export interface RefreshTokenRequest {
    token: string
}
export interface RefreshTokenResponse {
    token: string
}

export async function refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse>{
    try{
        const headers: Headers = new Headers();
        headers.append("Content-Type", "application/json");

        const response = await fetch(process.env.AUTH_SERVICE_URL + "/token", {
            headers: headers,
            method: "POST",
            body: JSON.stringify(request)
        })

        const data: RefreshTokenResponse = await response.json();
        if (response.status == 200){
            return data
        }
        else{

            throw new Error(`Unable to get token, status code ${response.status}`)
        }
    }
    catch (err){
        console.error(`[TOKENSERVICE] Err getting tokens: ${err}`)
        throw err
    }


}

export interface DeleteTokenRequest {
    token: string
}

export async function deleteToken(request: DeleteTokenRequest): Promise<void>{
    try{
        const headers: Headers = new Headers();
        headers.append("Content-Type", "application/json");

        const response = await fetch(process.env.AUTH_SERVICE_URL + "/logout", {
            headers: headers,
            method: "DELETE",
            body: JSON.stringify(request)
        })

        if (!(response.status >= 200 && response.status < 400)){
            throw new Error(`Unable to delete token, status code ${response.status}`)
        }
    }
    catch (err){
        console.error(`[TOKENSERVICE] Err getting tokens: ${err}`)
        throw err
    }
}
