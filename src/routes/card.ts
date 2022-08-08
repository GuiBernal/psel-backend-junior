import { Router } from "express";

import "express-async-errors";
import { createCard, getCardByAccount, getCardByPeople } from "../controllers/card";
import { routeNames } from "../helpers/routes";

const routes = Router();
const { card } = routeNames;

routes.post(card.post, createCard);
routes.get(card.getByAccount, getCardByAccount);
routes.get(card.getByPeople, getCardByPeople);

export default routes;
