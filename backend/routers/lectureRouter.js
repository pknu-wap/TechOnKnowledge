import express from "express";
import {
  postAddCurriculum,
  postPlusRecommend,
  postMinusRecommend,
  postUploadLecture,
  modifyLecture,
  getLecture,
  getLectureInformation,
  search,
} from "../controllers/lectureController";
import { auth } from "../middleware";
import routes from "../routes";

const lectureRouter = express.Router();

lectureRouter.get(routes.home, getLecture);
lectureRouter.get(routes.search(), search);

lectureRouter.post(routes.uploadLecture, auth, postUploadLecture);
lectureRouter.post(routes.plusRecommendLecture, auth, postPlusRecommend);
lectureRouter.post(routes.minusRecommendLecture, auth, postMinusRecommend);

lectureRouter.get(routes.modify, getLectureInformation);
lectureRouter.put(routes.modify, modifyLecture);
lectureRouter.post(routes.addCurriculum, auth, postAddCurriculum);
export default lectureRouter;
