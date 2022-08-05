import { knex } from "knex";
import app from "./app";
import knexConfig from "../knexfile";

const port = process.env.PORT ?? 9999;

export const db = knex(knexConfig);

db.migrate.latest();

app.listen(port, () => console.log(`Running on http://localhost:${port}`)); // eslint-disable-line no-console
