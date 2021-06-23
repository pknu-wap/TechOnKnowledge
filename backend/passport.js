import passport from "passport";
import kakaoStrategy from "passport-kakao";
import { kakaoLoginCallback } from "./controllers/authentication";
import User from "./models/User";

passport.use(User.createStrategy());

passport.use(
  new kakaoStrategy(
    {
      clientID: process.env.KAKAO_SECRET,
      callbackURL: `http://localhost:4000/auth/kakao/callback`,
    },
    kakaoLoginCallback
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
