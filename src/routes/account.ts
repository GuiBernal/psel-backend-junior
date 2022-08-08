import { Router } from "express";

import "express-async-errors";
import { createAccount, getAccounts, getBalance } from "../controllers/account";
import { routeNames } from "../helpers/routes";

const routes = Router();
const { account } = routeNames;

routes.post(account.post, createAccount);
routes.get(account.get, getAccounts);
routes.get(account.getBalance, getBalance);

export default routes;
