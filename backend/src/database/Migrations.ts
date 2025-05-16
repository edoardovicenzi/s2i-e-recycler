import { PoolConnection } from "mysql2/promise";
import { DatabaseConnection } from "./DatabaseConnection";


type MigrationDetail = {
    up: string,
    down: string
}


export class Migrations {
    private static migrations: MigrationDetail[] = [
    {
        up: "CREATE TABLE IF NOT EXISTS user (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, email VARCHAR(250) NOT NULL UNIQUE, password VARCHAR(250) NOT NULL, role VARCHAR(50) NOT NULL DEFAULT 'user')",
        down: "DROP TABLE IF EXISTS user",
    },
    {
        up: "CREATE TABLE IF NOT EXISTS category (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) UNIQUE)",
        down: "DROP TABLE IF EXISTS category",
    },
    {
        up: "CREATE TABLE IF NOT EXISTS manufacturer (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) UNIQUE)",
        down: "DROP TABLE IF EXISTS manufacturer",
    },
    {
        up: "CREATE TABLE IF NOT EXISTS product (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, category_id INT NOT NULL, manufacturer_id INT NOT NULL, name TEXT NOT NULL, price DECIMAL(64,2) NOT NULL, gpu VARCHAR(100) NOT NULL, cpu VARCHAR(100) NOT NULL, keyboardLayout VARCHAR(10) NOT NULL, display VARCHAR(100) NOT NULL, ram VARCHAR(100) NOT NULL, drives VARCHAR(100) NOT NULL, memory VARCHAR(20) NOT NULL, storage VARCHAR(100) NOT NULL, ports VARCHAR(100) NOT NULL, webcam VARCHAR(100) NOT NULL DEFAULT 'none', FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE, FOREIGN KEY (category_id) REFERENCES category(id) ON UPDATE CASCADE, FOREIGN KEY (manufacturer_id) REFERENCES manufacturer(id) ON UPDATE CASCADE)",
        down: "DROP TABLE IF EXISTS product",
    },
    {
        up: "CREATE TABLE IF NOT EXISTS shoppingCart (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, product_id INT NOT NULL, FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE ON UPDATE CASCADE)",
        down: "DROP TABLE IF EXISTS shoppingCart",
    },

    //insert operations
    {
        up: "INSERT INTO user (email, password) VALUES ('myemail@myemail.com', 'mytestpassowrd')",
        down: ""
    },
    {
        up: "INSERT INTO user (email, password) VALUES ('myemail2@myemail.com', 'mytestpassowrd')",
        down: ""
    },
    {
        up: "INSERT INTO user (email, password) VALUES ('myemail1@myemail.com', 'mytestpassowrd')",
        down: ""
    },
    {
        up: "INSERT INTO user (email, password) VALUES ('myemail3@myemail.com', 'mytestpassowrd')",
        down: ""
    },

    {
        up: "INSERT INTO category (name) VALUES ('laptop')",
        down: ""
    },
    {
        up: "INSERT INTO category (name) VALUES ('phone')",
        down: ""
    },
    {
        up: "INSERT INTO category (name) VALUES ('tablet')",
        down: ""
    },

    {
        up: "INSERT INTO manufacturer (name) VALUES ('samsung')",
        down: ""
    },
    {
        up: "INSERT INTO manufacturer (name) VALUES ('asus')",
        down: ""
    },
    {
        up: "INSERT INTO manufacturer (name) VALUES ('hp')",
        down: ""
    },
    {
        up: "INSERT INTO manufacturer (name) VALUES ('huawei')",
        down: ""
    },
    {
        up: "INSERT INTO manufacturer (name) VALUES ('dell')",
        down: ""
    },

    {
        up: "INSERT INTO product (user_id, category_id, manufacturer_id, name, price, gpu, cpu, keyboardLayout, display, ram, drives, memory, storage, ports, webcam) VALUES (1, 1, 1, 'refurbished old tech', 159.43, 'test gpu', 'test cpu', 'it', 'test display', 'test ram', 'test drives', 'test memory', 'test storage', 'test ports', 'test webcam')",
        down: ""
    },
    {
        up: "INSERT INTO product (user_id, category_id, manufacturer_id, name, price, gpu, cpu, keyboardLayout, display, ram, drives, memory, storage, ports) VALUES (1, 1, 1,'recyclers choice', 59.99, 'test gpu', 'test cpu', 'en-US', 'test display', 'test ram', 'test drives', 'test memory', 'test storage', 'test ports')",
        down: ""
    },
    {
        up: "INSERT INTO product (user_id, category_id, manufacturer_id, name, price, gpu, cpu, keyboardLayout, display, ram, drives, memory, storage, ports, webcam) VALUES (2, 2, 4,'test name', 130.88, 'test gpu', 'test cpu', 'en-US', 'test display', 'test ram', 'test drives', 'test memory', 'test storage', 'test ports', 'test webcam')",
        down: ""
    },

];

    public static async migrateDev(){
            await this.down();
            await this.up();
    }

    public static async up(){
        console.log("[Migrations] up started!");
        const conn: PoolConnection = await DatabaseConnection.getPool().getConnection();
        this.migrations.forEach( async (migration) => {
            console.log("[Migrations] executing: ", migration.up);
            await conn.execute(migration.up)
        })
        conn.release();
    }
    public static async down(){
        console.log("[Migrations] down started!");
        const conn: PoolConnection = await DatabaseConnection.getPool().getConnection();
        const reverseMigrations: MigrationDetail[] = Array.from(this.migrations).reverse();

        reverseMigrations.forEach(async (migration) => {
            if (migration.down.length){
                console.log("[Migrations] executing: ", migration.down);
                await conn.execute(migration.down)
            }
        })
        conn.release();
    }
}
