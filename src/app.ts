import cors from "cors";
import express from "express";

import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(routes);

export default app;
