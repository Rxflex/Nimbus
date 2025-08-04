import { Router } from 'express';
import { importRoutes } from "../utils/routes.js";
const router = Router();

importRoutes(router);

export default router;
