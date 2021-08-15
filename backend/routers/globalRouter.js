import express from "express";
import passport from "passport";
import {
  kakaoLogin,
  postChangePassword,
  postJoin,
  postKakaoLogIn,
  postLogin,
} from "../controllers/userController";
import { auth } from "../middleware";
import routes from "../routes";

const globalRouter = express.Router();

globalRouter.post(routes.signin, postLogin);
globalRouter.post(routes.signup, postJoin, postLogin);
globalRouter.post(routes.changePassword, auth, postChangePassword);

globalRouter.get(routes.kakao, kakaoLogin); //필요없을듯

globalRouter.get(
  routes.kakaoCallback,
  passport.authenticate("kakao", { failureRedurect: "/login" }),
  postKakaoLogIn
);

export default globalRouter;
