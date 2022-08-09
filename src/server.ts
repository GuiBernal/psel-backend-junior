import app from "./app";
import { db } from "./infra/database/db";

const port = process.env.PORT ?? 9999;

db.migrate.latest();

app.listen(port, () => console.log(`Running on http://localhost:${port}`)); // eslint-disable-line no-console
