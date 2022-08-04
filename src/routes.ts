import { Router } from "express";

import { rootRoutes } from "./routes/";

const routes = Router();

routes.use(rootRoutes);

export default routes;
