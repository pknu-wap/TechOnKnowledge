import express from "express";
import {
  getQuestion,
  postQuestion,
  putQuestion,
  deleteQuestion,
} from "../controllers/questions";
import { auth, checkAuth } from "../middleware";
import routes from "../routes";

const questionRouter = express.Router();

questionRouter.use(routes.home, auth);
//no require auth(optional)
questionRouter.get(routes.home, getQuestion);
//require auth
questionRouter.use(routes.home, checkAuth);
questionRouter.post(routes.home, postQuestion);
questionRouter.put(routes.home, putQuestion);
questionRouter.delete(routes.home, deleteQuestion);

export default questionRouter;
