import express from "express";
import { postAnswer, putAnswer, deleteAnswer } from "../controllers/answers";
import { auth } from "../middleware";
import routes from "../routes";

const answerRouter = express.Router();

answerRouter.all("/", auth);
answerRouter.post("/", postAnswer);
answerRouter.put("/", putAnswer);
answerRouter.delete("/", deleteAnswer);

export default answerRouter;
