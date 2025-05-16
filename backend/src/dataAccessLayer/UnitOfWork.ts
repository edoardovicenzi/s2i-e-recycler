import { PoolConnection } from "mysql2/promise";

import { DatabaseConnection } from "../database/DatabaseConnection";

import { UserRepository } from "./UserRepository";
import { CategoryRepository } from "./CategoryRepository";
import { ManufacturerRepository } from "./ManufacturerRepository";
import { ProductRepository } from "./ProductRepository";

export class UnitOfWork {

    private connection!: PoolConnection;
    private userRepositoryInstance?: UserRepository;
    private categoryRepositoryInstance?: CategoryRepository;
    private manufacturerRepositoryInstance?: ManufacturerRepository;
    private productRepositoryInstance?: ProductRepository;

    async start(): Promise<void>{
        this.connection = await DatabaseConnection.getPool().getConnection();
        await this.connection.beginTransaction();
    }

    get users(): UserRepository{
        if (!this.userRepositoryInstance){
            this.userRepositoryInstance = new UserRepository(this.connection);
        }
        return this.userRepositoryInstance;
    }

    get categories(): CategoryRepository {
        if (!this.categoryRepositoryInstance){
            this.categoryRepositoryInstance = new CategoryRepository(this.connection);
        }
        return this.categoryRepositoryInstance;
    }

    get manufacturers(): ManufacturerRepository {
        if (!this.manufacturerRepositoryInstance){
            this.manufacturerRepositoryInstance = new ManufacturerRepository(this.connection);
        }
        return this.manufacturerRepositoryInstance;
    }
    get products(): ProductRepository {
        if (!this.productRepositoryInstance){
            this.productRepositoryInstance = new ProductRepository(this.connection);
        }
        return this.productRepositoryInstance;
    }

    async commit(): Promise<void>{
        await this.connection.commit();
        this.connection.release();
    }

    async rollback(): Promise<void>{
        await this.connection.rollback();
        this.connection.release();
    }


}
