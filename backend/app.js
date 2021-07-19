import express from "express";
import passport from "passport";
import globalRouter from "./routers/globalRouter";
import lectureRouter from "./routers/lectureRouter";
import routes from "./routes";
import "./passport";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes.home, globalRouter);
app.use(routes.lecture, lectureRouter);

export default app;
