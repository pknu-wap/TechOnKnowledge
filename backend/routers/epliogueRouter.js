import express from "express";
import {
  getEpliogue,
  postEpliogue,
  putEpliogue,
  deleteEpliogue,
  recommendation,
} from "../controllers/epliogues";
import { auth } from "../middleware";
import routes from "../routes";

const epliogueRouter = express.Router();

epliogueRouter.get("/", getEpliogue);

epliogueRouter.all("/", auth);
epliogueRouter.post("/", postEpliogue);
epliogueRouter.put("/", putEpliogue);
epliogueRouter.delete("/", deleteEpliogue);
epliogueRouter.post(routes.recommendEpliogue, auth, recommendation);

export default epliogueRouter;
