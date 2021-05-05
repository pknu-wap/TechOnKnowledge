import express from "express";
import passport from "passport";
import routes from "./routes";
import "./passport";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

export default app;
