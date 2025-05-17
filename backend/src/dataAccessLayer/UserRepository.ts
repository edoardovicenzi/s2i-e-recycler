import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import type { Role } from "../types/types";

export type User = {
    id?: number,
    email?: string,
    password?: string,
    role?: Role
}

export class UserRepository {
    private _conn: PoolConnection;
    private _table: string = "user";

    constructor(connection: PoolConnection){
        this._conn = connection
    }

    public async add(user: User): Promise<number>{
        try {
            const [result] = await this._conn.query<ResultSetHeader>(
                `INSERT INTO ${this._table} (email, password, role) VALUES (?, ?, ?)`,
                [user.email, user.password, user.role || "user"]
            );
            return result.insertId;
        }
        catch (err){
            console.error(err);
            throw err
        }

    }
    public async addMulti(users: User[]): Promise<void>{
        try {
            users.forEach((user) => {
                this.add(user);
            })
        }
        catch (err){
            console.error(err);
            throw err
        }

    }
    public async get(): Promise<User[]> {
        try {
            const [results] = await this._conn.query(
                `SELECT * FROM ${this._table}`
            );
            return results as User[]
        }
        catch (err){
            console.error(err);
            throw err
        }
    }

    public async getById(id: number): Promise<User> {
        try {
            const [results] = await this._conn.execute(
                `SELECT * FROM ${this._table} WHERE id = ?`,
                [id]
            );
            return (results as any)[0] as User
        }
        catch (err){
            console.error(err);
            throw err
        }

    }
    public async getByEmail(email: string): Promise<User> {
        try {
            const [results] = await this._conn.execute(
                `SELECT * FROM ${this._table} WHERE email = ?`,
                [email]
            );
            return (results as any)[0] as User
        }
        catch (err){
            console.error(err);
            throw err
        }

    }
    
    public async update(user: User): Promise<void>{
        try {
            const [result] = await this._conn.execute(
                `UPDATE ${this._table} SET email = ? , password = ? , role = ? WEHRE id = ?`,
                [
                    user.email,
                    user.password,
                    user.role || "user",
                    user.id
                ]
            );
        }
        catch (err){
        }

    }

    public async deleteById(id: number): Promise<void> {
        try {
            const [results] = await this._conn.execute(
                `DELETE FROM ${this._table} WHERE id = ?`,
                [id]
            )
        }
        catch (err){
            console.error(err);
            throw err
        }

    }
    //Email is a UNIQUE field so it is safe
    public async deleteByEmail(email: string): Promise<void> {
        try {
            const [results] = await this._conn.execute(
                `DELETE FROM ${this._table} WHERE email = ?`,
                [email]
            )
        }
        catch (err){
            console.error(err);
            throw err
        }
    }
}
