import { PoolConnection } from "mysql2/promise";

export type Category = {
    id?: number,
    name: string,
}
export class CategoryRepository {
    private _conn: PoolConnection;
    private _table: string = "category";

    constructor(connection: PoolConnection){
        this._conn = connection
    }

    public async getAll(): Promise<Category[]> {
        try {
            const [results] = await this._conn.query(
                `SELECT * FROM ${this._table}`
            );
            return results as Category[]
        }
        catch (err){
            console.error(err);
            throw err
        }
    }

    public async getById(id: number): Promise<Category> {
        try {
            const [results] = await this._conn.execute(
                `SELECT * FROM ${this._table} WHERE id = ?`,
                [id]
            );
            return (results as any)[0] as Category
        }
        catch (err){
            console.error(err);
            throw err
        }
    }

    public async getByName(name: string): Promise<Category> {
        try {
            const [results] = await this._conn.execute(
                `SELECT * FROM ${this._table} WHERE name = ?`,
                [name]
            );
            return (results as any)[0] as Category
        }
        catch (err){
            console.error(err);
            throw err
        }
    }
}
