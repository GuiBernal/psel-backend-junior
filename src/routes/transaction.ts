import { Router } from "express";

import "express-async-errors";
import { createTransaction, getTransactions, revertTransaction } from "../controllers/transaction";
import { routeNames } from "../helpers/routes";

const routes = Router();
const { transaction } = routeNames;

routes.post(transaction.post, createTransaction);
routes.get(transaction.get, getTransactions);
routes.post(transaction.postRevert, revertTransaction);

export default routes;
