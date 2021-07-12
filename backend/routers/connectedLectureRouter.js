import express from "express";
import {
  postConnectedLecutre,
  putConnectedLecture,
  deleteConnectedLecture,
} from "../controllers/connected_lectures";
import routes from "../routes";

const connectedLectureRouter = express.Router();

connectedLectureRouter.post(routes.postConnectedLecutre, postConnectedLecutre);
connectedLectureRouter.put(routes.putConnectedLecutre, putConnectedLecture);
connectedLectureRouter.delete(
  routes.deleteConnectedLecutre,
  deleteConnectedLecture
);

export default connectedLectureRouter;
