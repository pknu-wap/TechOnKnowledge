import express from "express";
import {
  postAddCurriculum,
  postPlusRecommend,
  postMinusRecommend,
  postUploadLecture,
} from "../controllers/lectureController";
import { auth } from "../middleware";
import routes from "../routes";

const lectureRouter = express.Router();

lectureRouter.post(routes.uploadLecture, auth, postUploadLecture);
lectureRouter.post(routes.plusRecommendLecture, auth, postPlusRecommend);
lectureRouter.post(routes.minusRecommendLecture, auth, postMinusRecommend);

lectureRouter.post(routes.addCurriculum, auth, postAddCurriculum);

export default lectureRouter;
