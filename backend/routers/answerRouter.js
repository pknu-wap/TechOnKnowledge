import express from "express";
import { postAnswer, putAnswer, deleteAnswer } from "../controllers/answers";
import { auth, checkAuth } from "../middleware";
import routes from "../routes";

const answerRouter = express.Router();

//require auth
answerRouter.use(routes.home, auth, checkAuth);
answerRouter.post(routes.home, postAnswer);
answerRouter.put(routes.home, putAnswer);
answerRouter.delete(routes.home, deleteAnswer);

export default answerRouter;
