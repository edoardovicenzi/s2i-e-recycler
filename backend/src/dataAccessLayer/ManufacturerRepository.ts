import { PoolConnection } from "mysql2/promise";

export type Manufacturer = {
    id: number,
    name: string,
}

export class ManufacturerRepository {
    private _conn: PoolConnection;
    private _table: string = "manufacturer";

    constructor(connection: PoolConnection){
        this._conn = connection
    }

    public async getAll(): Promise<Manufacturer[]> {
        try {
            const [results] = await this._conn.query(
                `SELECT * FROM ${this._table} ORDER BY id`
            );
            return results as Manufacturer[]
        }
        catch (err){
            console.error(err);
            throw err
        }
    }

    public async getById(id: number): Promise<Manufacturer> {
        try {
            const [results] = await this._conn.execute(
                `SELECT * FROM ${this._table} WHERE id = ?`,
                [id]
            );
            return (results as any)[0] as Manufacturer
        }
        catch (err){
            console.error(err);
            throw err
        }
    }

    public async getByName(name: string): Promise<Manufacturer> {
        try {
            const [results] = await this._conn.execute(
                `SELECT * FROM ${this._table} WHERE name = ?`,
                [name]
            );
            return (results as any)[0] as Manufacturer
        }
        catch (err){
            console.error(err);
            throw err
        }
    }
}
