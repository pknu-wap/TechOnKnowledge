import express from "express";
import {
  getConnectedLecture,
  postConnectedLecutre,
  putConnectedLecture,
  deleteConnectedLecture,
  recommendation,
} from "../controllers/connected_lectures";
import { auth } from "../middleware";
import routes from "../routes";

const connectedLectureRouter = express.Router();

connectedLectureRouter.get("/", getConnectedLecture);

connectedLectureRouter.all("/", auth);
connectedLectureRouter.post("/", postConnectedLecutre);
connectedLectureRouter.put("/", putConnectedLecture);
connectedLectureRouter.delete("/", deleteConnectedLecture);
connectedLectureRouter.post(
  routes.recommendConnectedLecture,
  auth,
  recommendation
);

export default connectedLectureRouter;
