import express from "express";
import passport from "passport";
import globalRouter from "./routers/globalRouter";
import lectureRouter from "./routers/lectureRouter";
import epliogueRouter from "./routers/epliogueRouter";
import questionRouter from "./routers/questionRouter";
import connectedLectureRouter from "./routers/connectedLectureRouter";
import routes from "./routes";
import answerRouter from "./routers/answerRouter";
import "./passport";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.use(routes.home, globalRouter);
app.use(routes.lecture, lectureRouter);
app.use(routes.epliouge, epliogueRouter);
app.use(routes.connectedLecture, connectedLectureRouter);
app.use(routes.QnA, questionRouter);
app.use(routes.QnAAnswer, answerRouter);

export default app;
