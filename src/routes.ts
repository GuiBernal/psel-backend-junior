import { Router } from "express";
import { rootRoutes, peopleRoutes, accountRoutes, cardRoutes, transactionRoutes } from "./routes/index";

const routes = Router();

routes.use(rootRoutes);
routes.use(peopleRoutes);
routes.use(accountRoutes);
routes.use(cardRoutes);
routes.use(transactionRoutes);

export default routes;
