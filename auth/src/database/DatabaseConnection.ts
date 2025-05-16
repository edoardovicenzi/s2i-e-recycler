import dotenv from "dotenv";
import { Connection, ConnectionOptions, createConnection } from "mysql2/promise";

dotenv.config();

export class DatabaseConnection {
    private static _options: ConnectionOptions = {
        host: process.env.DB_AUTH_HOSTNAME || "localhost",
        port: parseInt(process.env.DB_AUTH_PORT || "5050") ,
        user: process.env.DB_AUTH_USER,
        password: process.env.DB_AUTH_USER_PASSWORD,
        database: process.env.DB_AUTH_DATABASE_NAME
    }
    private static _connection: Connection;

    private constructor() {

    }

    public static async getConnection(): Promise<Connection> {
        if (!DatabaseConnection._connection) {
            DatabaseConnection._connection = await createConnection(this._options);
        }
        return DatabaseConnection._connection;
    }
}
