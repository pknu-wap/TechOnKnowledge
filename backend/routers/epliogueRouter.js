import express from "express";
import {
  getEpliogue,
  postEpliogue,
  putEpliogue,
  deleteEpliogue,
  recommendation,
} from "../controllers/epliogues";
import { auth, checkAuth } from "../middleware";
import routes from "../routes";

const epliogueRouter = express.Router();

epliogueRouter.use(routes.home, auth);
//no require auth(optional)
epliogueRouter.get(routes.home, getEpliogue);
//require auth
epliogueRouter.use(routes.home, checkAuth);
epliogueRouter.post(routes.home, postEpliogue);
epliogueRouter.put(routes.home, putEpliogue);
epliogueRouter.delete(routes.home, deleteEpliogue);
epliogueRouter.post(routes.recommendEpliogue, recommendation);

export default epliogueRouter;
