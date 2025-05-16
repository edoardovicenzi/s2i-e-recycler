import { Connection, FieldPacket, QueryResult } from "mysql2/promise";
import { DatabaseConnection } from "./DatabaseConnection";

export class TokenRepository {
    private _conn: Connection;
    constructor() {
        this.init();
    }

    private async init(): Promise<void> {
        //Run migration

        try {
            this._conn = await DatabaseConnection.getConnection();
            const [results, fields] = await this._conn.query(
                'CREATE TABLE IF NOT EXISTS jwt (id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, refreshToken varchar(250) NOT NULL)'
            )
        } catch (error) {
            throw error
        }
    }

    //Create
    public async add(token: string): Promise<void> {
        try {
            const [results, fields] = await this._conn.execute(
                'INSERT INTO jwt (refreshToken) VALUES (?)',
                [token.toString().trim()]
            )
        } catch (error) {
            throw error
        }
    }
    //Read
    public async getByString(token: string): Promise<[QueryResult, FieldPacket[]]> {
        try {
            const [results, fields] = await this._conn.execute(
                'SELECT refreshToken FROM jwt WHERE refreshToken = ?',
                [token.toString().trim()]
            )
            return [results, fields];
        } catch (error) {
            throw error
        }
    }
    public async getById(id: string) {
        try {
            const [results, fields] = await this._conn.execute(
                'SELECT refreshToken FROM jwt WHERE id = ?',
                [id]
            )
            return [results, fields];
        } catch (error) {
            throw error
        }
    }

    //Delete
    public async deleteByString(token: string) {
        try {
            const [results, fields] = await this._conn.execute(
                'DELETE FROM jwt WHERE refreshToken = ?',
                [token.toString().trim()]
            )
        } catch (error) {
            throw error
        }
    }
    public async deleteId(id: number) {
        try {
            const [results, fields] = await this._conn.execute(
                'DELETE FROM jwt WHERE id = ?',
                [id]
            )
        } catch (error) {
            throw error
        }
    }

}
