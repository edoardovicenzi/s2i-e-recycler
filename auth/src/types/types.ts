export type User = {
    userId: number,
    role: Roles
}

export enum Roles {
    USER = "user",
    ADMIN = "admin",
}
