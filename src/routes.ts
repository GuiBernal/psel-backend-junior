import { Router } from "express";

import { rootRoutes } from "./routes/index";

const routes = Router();

routes.use(rootRoutes);

export default routes;
