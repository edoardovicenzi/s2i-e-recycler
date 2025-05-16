import express from "express";
import dotenv from "dotenv";

// Middlewares

// Routers
import { router as categoriesRouter } from "./routers/categories";
import { router as manufacturersRouter } from "./routers/manufacturers";
import { router as productsRouter } from "./routers/products";
import { router as authRouter } from "./routers/auth";

//Utility
import { Migrations } from "./database/Migrations";

//Pre Init

dotenv.config()

//Run migrations

// if (process.env.NODE_ENV !== 'production'){
//     Migrations.migrateDev();
// }
//
// else{
//     Migrations.up();
// }

//init
const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.get("/ready", (_, res) => {
    res.sendStatus(200);
})


// || USER
app.use("/", authRouter);

// || CATEGORY
app.use("/categories", categoriesRouter);

// || MANUFACTURER
app.use("/manufacturers", manufacturersRouter);

// || PRODUCT
app.use("/products", productsRouter);

// || SHOPPING CART
// TODO: Future works: shopping cart api

// || SHOPPING CART
// TODO: Future works: payment

// || Start server
app.listen(PORT, () => {
    console.log(`E-recycler server listening to port ${PORT}`)
})
