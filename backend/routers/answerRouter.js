import express from "express";
import { postAnswer, putAnswer, deleteAnswer } from "../controllers/answers";
import routes from "../routes";

const answerRouter = express.Router();

answerRouter.post(routes.postAnswer, postAnswer);
answerRouter.put(routes.putAnswer, putAnswer);
answerRouter.delete(routes.deleteAnswer, deleteAnswer);

export default answerRouter;
