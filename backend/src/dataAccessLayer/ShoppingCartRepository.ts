import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import type { User } from "./UserRepository";
import type { Product } from "./ProductRepository";

export type ShoppingCart = {
    id: number,
    user: User,
    products: Product[]
}
