import express from "express";
import {
  getQuestion,
  postQuestion,
  putQuestion,
  deleteQuestion,
} from "../controllers/questions";
import { postAnswer, putAnswer, deleteAnswer } from "../controllers/answers";
import routes from "../routes";

const QnARouter = express.Router();

QnARouter.get(routes.getQnA, getQuestion);
QnARouter.post(routes.postQuestion, postQuestion);
QnARouter.put(routes.putQuestion, putQuestion);
QnARouter.delete(routes.deleteQuestion, deleteQuestion);
QnARouter.post(routes.postAnswer, postAnswer);
QnARouter.put(routes.putAnswer, putAnswer);
QnARouter.delete(routes.deleteAnswer, deleteAnswer);

export default QnARouter;
