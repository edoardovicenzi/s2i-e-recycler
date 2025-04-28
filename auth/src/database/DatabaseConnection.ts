import { Connection, ConnectionOptions, createConnection } from "mysql2/promise";

export class DatabaseConnection {
    private static _options: ConnectionOptions = {
        //TODO: migrate to .env file
        host: "localhost",
        port: 5050,
        user: "auth",
        password: "verysecurepassword",
        database: "auth"
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
