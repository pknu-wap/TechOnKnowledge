import express from "express";
import {
  getEpliogue,
  postEpliogue,
  putEpliogue,
  deleteEpliogue,
  recommendation,
} from "../controllers/epliogues";
import { auth, tryAuth } from "../middleware";
import routes from "../routes";

const epliogueRouter = express.Router();

//no require auth
epliogueRouter.get(routes.home, tryAuth, getEpliogue);
//require auth
epliogueRouter.use(routes.home, auth);
epliogueRouter.post(routes.home, postEpliogue);
epliogueRouter.put(routes.home, putEpliogue);
epliogueRouter.delete(routes.home, deleteEpliogue);
epliogueRouter.post(routes.recommendEpliogue, recommendation);

export default epliogueRouter;
