import { Router } from "express";

import "express-async-errors";
import { createPeople } from "../controllers/people";
import { routeNames } from "../helpers/routes";

const routes = Router();
const { people } = routeNames;

routes.post(people.post, createPeople);

export default routes;
