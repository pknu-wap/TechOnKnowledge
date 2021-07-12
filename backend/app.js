import express from "express";
import passport from "passport";
import globalRouter from "./routers/globalRouter";
import lectureRouter from "./routers/lectureRouter";
import epliogueRouter from "./routers/epliogueRouter";
import QnARouter from "./routers/QnARouter";
import connectedLectureRouter from "./routers/connectedLectureRouter";
import routes from "./routes";
import "./passport";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes.home, globalRouter);
app.use(routes.lectures, lectureRouter);
app.use(routes.epliouge, epliogueRouter);
app.use(routes.connectedLecture, connectedLectureRouter);
app.use(routes.QnARouter, QnARouter);

export default app;
