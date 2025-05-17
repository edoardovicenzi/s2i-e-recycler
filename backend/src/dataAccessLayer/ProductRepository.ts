import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { User } from "./UserRepository";
import type { Category } from "./CategoryRepository";
import type { Manufacturer } from "./ManufacturerRepository";

export type Product = {
    id?: number,
    user: User,
    category: Category,
    manufacturer: Manufacturer,
    name: string,
    price: string,
    gpu: string,
    cpu: string,
    keyboardLayout: string,
    display: string,
    ram: string,
    drives: string,
    memory: string,
    storage: string,
    ports: string,
    webcam?: string,
}

export class ProductRepository {
    private _conn: PoolConnection;
    private _table: string = "product";
    private _userTable: string = "user";
    private _categoryTable: string = "category";
    private _manufacturerTable: string = "manufacturer";

    constructor(connection: PoolConnection){
        this._conn = connection
    }

    public async add(product: Product): Promise<number>{
        try {
            const query = `INSERT INTO ${this._table} (
                    user_id,
                    category_id,
                    manufacturer_id,
                    name,
                    price,
                    gpu,
                    cpu,
                    keyboardLayout,
                    display,
                    ram,
                    drives,
                    memory,
                    storage,
                    ports,
                    webcam
                ) VALUES (
                    :user_id,
                    :category_id,
                    :manufacturer_id,
                    :name,
                    :price,
                    :gpu,
                    :cpu,
                    :keyboardLayout,
                    :display,
                    :ram,
                    :drives,
                    :memory,
                    :storage,
                    :ports,
                    :webcam
                )`

                const params = {
                    user_id: product.user.id,
                    category_id: product.category.id,
                    manufacturer_id: product.manufacturer.id,
                    name: product.name,
                    price: product.price,
                    gpu: product.gpu,
                    cpu: product.cpu,
                    keyboardLayout: product.keyboardLayout,
                    display: product.display,
                    ram: product.ram,
                    drives: product.drives,
                    memory: product.memory,
                    storage: product.storage,
                    ports: product.ports,
                    webcam: product.webcam || "none"
                }

            const [result] = await this._conn.execute<ResultSetHeader>(query,params);
            return result.insertId;
        }
        catch (err){
            throw err
        }

    }

    public async addMulti(products: Product[]): Promise<void>{
        try {
            products.forEach((product) => {
                this.add(product);
            })
        }
        catch (err){
            console.error(err);
            throw err
        }

    }

    public async getAll(): Promise<Product[]> {
        try {
            const [results] = await this._conn.execute<RowDataPacket[]>(
                `SELECT 
                    p.*, 
                    c.name AS category_name,
                    c.id AS category_id,
                    m.name AS manufacturer_name,
                    m.id AS manufacturer_id,
                    u.email AS email,
                    u.id AS user_id
                FROM ${this._table} p
                JOIN ${this._categoryTable} c ON p.category_id = c.id
                JOIN ${this._userTable} u ON p.user_id = u.id
                JOIN ${this._manufacturerTable} m ON p.manufacturer_id = m.id
                `
            );

            const products: Product[] = results.map((result) => {
                return {
                    id: result.id,
                    user: {
                        id: result.user_id,
                        email: result.email
                    },
                    category: {
                        id: result.category_id,
                        name: result.category_name
                    },
                    manufacturer: {
                        id: result.manufacturer_id,
                        name: result.manufacturer_name
                    },
                    name: result.name,
                    price: result.price,
                    gpu: result.gpu,
                    cpu: result.cpu,
                    keyboardLayout: result.keyboardLayout,
                    display: result.display,
                    ram: result.ram,
                    drives: result.drives,
                    memory: result.memory,
                    storage: result.storage,
                    ports: result.ports,
                    webcam: result.webcam,
                }
            })

            return products
        }
        catch (err){
            console.error(err);
            throw err
        }
    }

    public async getById(id: number): Promise<Product> {
        try {
            const [result] = await this._conn.execute<RowDataPacket[]>(
                `SELECT 
                    p.*, 
                    c.name AS category_name,
                    c.id AS category_id,
                    m.name AS manufacturer_name,
                    m.id AS manufacturer_id,
                    u.id AS user_id,
                    u.email AS email
                FROM ${this._table} p
                JOIN ${this._categoryTable} c ON p.category_id = c.id
                JOIN ${this._userTable} u ON p.user_id = u.id
                JOIN ${this._manufacturerTable} m ON p.manufacturer_id = m.id
                WHERE p.id = ?
                `,
                [id]
            );
            const row = result[0]
            return {
                    id: row.id,
                    user: {
                        id: row.user_id,
                        email: row.email
                    },
                    category: {
                        id: row.category_id,
                        name: row.category_name
                    },
                    manufacturer: {
                        id: row.manufacturer_id,
                        name: row.manufacturer_name
                    },
                    name: row.name,
                    price: row.price,
                    gpu: row.gpu,
                    cpu: row.cpu,
                    keyboardLayout: row.keyboardLayout,
                    display: row.display,
                    ram: row.ram,
                    drives: row.drives,
                    memory: row.memory,
                    storage: row.storage,
                    ports: row.ports,
                    webcam: row.webcam,
                }

        }
        catch (err){
            console.error(err);
            throw err
        }
    }

    public async getByCategory(category: Category): Promise<Product[]> {
        try {
            const [results] = await this._conn.execute(
                `SELECT * FROM ${this._table} WHERE category_id = ?`,
                [category.id]
            );
            return results as Product[]
        }
        catch (err){
            console.error(err);
            throw err
        }

    }
    public async getByManufacturer(manufacturer: Manufacturer): Promise<Product[]> {
        try {

            const [results] = await this._conn.execute(
                `SELECT * FROM ${this._table} WHERE manufacturer_id = ?`,
                [manufacturer.id]
            );
            return results as Product[]
        }
        catch (err){
            console.error(err);
            throw err
        }

    }
    
    public async update(product: Product): Promise<void>{
        try {
            const [results] = await this._conn.execute(
                `UPDATE ${this._table}
                SET
                user_id = :user_id,
                    category_id = :category_id,
                    manufacturer_id = :manufacturer_id,
                    name = :name,
                    price = :price,
                    gpu = :gpu,
                    cpu = :cpu,
                    keyboardLayout = :keyboardLayout,
                    display = :display,
                    ram = :ram,
                    drives = :drives,
                    memory = :memory,
                    storage = :storage,
                    ports = :ports,
                    webcam = :webcam
                WHERE id = :id`,
                    {
                    user_id: product.user.id,
                    category_id: product.category.id,
                    manufacturer_id: product.manufacturer.id,
                    name: product.name,
                    price: product.price,
                    gpu: product.gpu,
                    cpu: product.cpu,
                    keyboardLayout: product.keyboardLayout,
                    display: product.display,
                    ram: product.ram,
                    drives: product.drives,
                    memory: product.memory,
                    storage: product.storage,
                    ports: product.ports,
                    webcam: product.webcam || "none",
                    id: product.id
                }
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
}
