import express from "express";
import {
  getConnectedLecture,
  postConnectedLecutre,
  putConnectedLecture,
  deleteConnectedLecture,
  recommendation,
} from "../controllers/connected_lectures";
import { auth, checkAuth } from "../middleware";
import routes from "../routes";

const connectedLectureRouter = express.Router();

connectedLectureRouter.use(routes.home, auth);
//no require auth(optional)
connectedLectureRouter.get(routes.home, getConnectedLecture);
//require auth
connectedLectureRouter.use(routes.home, checkAuth);
connectedLectureRouter.post(routes.home, postConnectedLecutre);
connectedLectureRouter.put(routes.home, putConnectedLecture);
connectedLectureRouter.delete(routes.home, deleteConnectedLecture);
connectedLectureRouter.post(routes.recommendConnectedLecture, recommendation);

export default connectedLectureRouter;
