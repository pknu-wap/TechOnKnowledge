import express from "express";
import {
  getConnectedLecture,
  postConnectedLecutre,
  putConnectedLecture,
  deleteConnectedLecture,
  recommendationBefore,
  recommendationAfter,
} from "../controllers/connected_lectures";
import routes from "../routes";

const connectedLectureRouter = express.Router();

connectedLectureRouter.get(routes.getConnectedLecture, getConnectedLecture);
connectedLectureRouter.post(routes.postConnectedLecture, postConnectedLecutre);
connectedLectureRouter.put(routes.putConnectedLecture, putConnectedLecture);
connectedLectureRouter.delete(
  routes.deleteConnectedLecture,
  deleteConnectedLecture
);
connectedLectureRouter.post(
  routes.recommendationBeforeConnectedLecture,
  recommendationBefore
);
connectedLectureRouter.post(
  routes.recommendationAfterConnectedLecture,
  recommendationAfter
);

export default connectedLectureRouter;
