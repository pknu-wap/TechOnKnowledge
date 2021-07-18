import express from "express";
import {
  getLectureInfo,
  postAddCurriculum,
  postUploadLecture,
} from "../controllers/lecture";
import routes from "../routes";

const lectureRouter = express.Router({ mergeParams: true });

lectureRouter.post(routes.uploadLecture, postUploadLecture);
lectureRouter.post(routes.addCurriculum, postAddCurriculum);
lectureRouter.get("/", getLectureInfo);

export default lectureRouter;
