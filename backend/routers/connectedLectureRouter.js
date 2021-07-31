import express from "express";
import {
  getConnectedLecture,
  postConnectedLecutre,
  putConnectedLecture,
  deleteConnectedLecture,
  recommendation,
} from "../controllers/connected_lectures";
import { auth, tryAuth } from "../middleware";
import routes from "../routes";

const connectedLectureRouter = express.Router();

//no require auth
connectedLectureRouter.get(routes.home, tryAuth, getConnectedLecture);
//require auth
connectedLectureRouter.use(routes.home, auth);
connectedLectureRouter.post(routes.home, postConnectedLecutre);
connectedLectureRouter.put(routes.home, putConnectedLecture);
connectedLectureRouter.delete(routes.home, deleteConnectedLecture);
connectedLectureRouter.post(routes.recommendConnectedLecture, recommendation);

export default connectedLectureRouter;
