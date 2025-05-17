import dotenv from "dotenv";
import { ConnectionOptions, createPool, Pool } from "mysql2/promise";


export class DatabaseConnection {
    private static _options: ConnectionOptions = {
        host: process.env.DB_HOSTNAME || "localhost",
        port: parseInt(process.env.DB_PORT || "4050"),
        user: process.env.DB_USER,
        password: process.env.DB_USER_PASSWORD,
        database: process.env.DB_DATABASE_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        namedPlaceholders: true,
    }
    private static _connection: Pool;

    private constructor() {

    }

    public static getPool(): Pool {
        dotenv.config();

        if (!DatabaseConnection._connection) {
            DatabaseConnection._connection = createPool(this._options);
        }
        return DatabaseConnection._connection;
    }
}
