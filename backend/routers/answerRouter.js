import express from "express";
import { postAnswer, putAnswer, deleteAnswer } from "../controllers/answers";
import { auth } from "../middleware";
import routes from "../routes";

const answerRouter = express.Router();

//require auth
answerRouter.use(routes.home, auth);
answerRouter.post(routes.home, postAnswer);
answerRouter.put(routes.home, putAnswer);
answerRouter.delete(routes.home, deleteAnswer);

export default answerRouter;
