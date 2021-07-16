import express from "express";
import {
  postAddCurriculum,
  postRecommend,
  postUploadLecture,
} from "../controllers/lectureController";
import routes from "../routes";

const lectureRouter = express.Router();

lectureRouter.post(routes.uploadLecture, postUploadLecture);
lectureRouter.post(routes.recommendLecture, postRecommend);
lectureRouter.post(routes.addCurriculum, postAddCurriculum);

export default lectureRouter;
