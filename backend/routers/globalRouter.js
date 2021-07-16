import express from "express";
import passport from "passport";
import {
  kakaoLogin,
  logout,
  postChangePassword,
  postJoin,
  postKakaoLogIn,
  search,
} from "../controllers/userController";
import routes from "../routes";

const globalRouter = express.Router();

globalRouter.post(routes.signin, postJoin);
globalRouter.post(routes.signup, postJoin);
globalRouter.get(routes.logout, logout);
globalRouter.post(routes.changePassword, postChangePassword);

globalRouter.get(routes.search(), search);

globalRouter.get(routes.kakao, kakaoLogin);

globalRouter.get(
  routes.kakaoCallback,
  passport.authenticate("kakao", { failureRedurect: "/login" }),
  postKakaoLogIn
);

export default globalRouter;
