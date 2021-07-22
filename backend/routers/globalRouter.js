import express from "express";
import passport from "passport";
import {
  kakaoLogin,
  logout,
  postChangePassword,
  postJoin,
  postKakaoLogIn,
  postLogin,
  search,
} from "../controllers/userController";
import { auth } from "../middleware";
import routes from "../routes";

const globalRouter = express.Router();

globalRouter.post(routes.signin, postLogin);
globalRouter.post(routes.signup, postJoin, postLogin);
globalRouter.get(routes.logout, auth, logout);
globalRouter.post(routes.changePassword, postChangePassword);

globalRouter.get(routes.search(), search);

globalRouter.get(routes.kakao, kakaoLogin); //필요없을듯

globalRouter.get(
  routes.kakaoCallback,
  passport.authenticate("kakao", { failureRedurect: "/login" }),
  postKakaoLogIn
);

export default globalRouter;
