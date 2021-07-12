import express from "express";
import {
  getEpliogue,
  postEpliogue,
  putEpliogue,
  deleteEpliogue,
} from "../controllers/epliogues";
import routes from "../routes";

const epliogueRouter = express.Router();

epliogueRouter.get(routes.getEpliogue, getEpliogue);
epliogueRouter.post(routes.postEpliogue, postEpliogue);
epliogueRouter.put(routes.putEpliogue, putEpliogue);
epliogueRouter.delete(routes.deleteEpliogue, deleteEpliogue);

export default epliogueRouter;
