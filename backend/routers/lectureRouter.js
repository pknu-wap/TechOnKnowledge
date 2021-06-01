import express from "express";
import { postAddCurriculum, postUploadLecture } from "../controllers/lecture";
import routes from "../routes";

const lectureRouter = express.Router();

lectureRouter.post(routes.uploadLecture, postUploadLecture);
lectureRouter.post(routes.addCurriculum, postAddCurriculum);
