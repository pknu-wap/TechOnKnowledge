import express from "express";
import {
  getQuestion,
  postQuestion,
  putQuestion,
  deleteQuestion,
} from "../controllers/questions";
import routes from "../routes";

const questionRouter = express.Router();

questionRouter.get(routes.getQnA, getQuestion);
questionRouter.post(routes.postQuestion, postQuestion);
questionRouter.put(routes.putQuestion, putQuestion);
questionRouter.delete(routes.deleteQuestion, deleteQuestion);

export default questionRouter;
