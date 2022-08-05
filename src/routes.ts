import { Router } from "express";

import { rootRoutes, peopleRoutes, accountRoutes } from "./routes/index";

const routes = Router();

routes.use(rootRoutes);
routes.use(peopleRoutes);
routes.use(accountRoutes);

export default routes;
