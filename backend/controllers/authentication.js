import passport from "passport";
import User from "../models/User";

export const search = () => {
  console.log("this function will excute search some lectures");
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "join" });
  } else {
    try {
      const user = await User({
        name,
        email,
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      //   res.redirect(routes.home);
    }
  }
};

export const postLogin = passport.authenticate("local", {
  //   failureRedirect: routes.login,
  //   successRedirect: routes.home,
});

export const postKakaoLogIn = (req, res) => {
  // res.redirect(routes.home);
};

export const kakaoLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.kakaoId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      kakaoId: id,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const kakaoLogin = passport.authenticate("kakao");

export const logout = (req, res) => {
  req.logout();
  //   res.redirect(routes.home);
};

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  try {
    if (newPassword !== newPassword1) {
      res.status(200);
      //   res.redirect(routes.changePassword);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    // res.redirect(routes.me);
  } catch (error) {
    console.log(error);
    // res.render(routes.changePassword);
  }
};
