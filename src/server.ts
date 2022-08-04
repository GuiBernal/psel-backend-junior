import app from "./app";
import knexConfig from "../knexfile";
import { knex } from "knex";

const port = process.env.PORT ?? 9999;

export const db = knex(knexConfig);

db.migrate.latest();
app.listen(port, () => console.log(`Running on http://localhost:${port}`));
