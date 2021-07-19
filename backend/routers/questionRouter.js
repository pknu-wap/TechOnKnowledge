import express from "express";
import {
  getQuestion,
  postQuestion,
  putQuestion,
  deleteQuestion,
} from "../controllers/questions";
import { auth } from "../middleware";
import routes from "../routes";

const questionRouter = express.Router();

questionRouter.get("/", getQuestion);

questionRouter.all("/", auth);
questionRouter.post("/", postQuestion);
questionRouter.put("/", putQuestion);
questionRouter.delete("/", deleteQuestion);

export default questionRouter;
