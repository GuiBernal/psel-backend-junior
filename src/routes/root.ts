import { Router } from "express";
import type { Request, Response } from "express";
import "express-async-errors";
import { routeNames } from "../helpers/routes";

const routes = Router();
const { root } = routeNames;

routes.get(root.get, (_: Request, res: Response) => res.status(200).json({ ok: true }));

export default routes;
