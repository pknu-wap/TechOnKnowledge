import passport from "passport";
import User from "../models/User";
import Lecture from "../models/Lecture";
import routes from "../routes";

export const search = async (req, res) => {
  let {
    params: { content: subject }, //title, teacher
    query: { content: searchingBy, page, sort },
  } = req;
  if (page === undefined) page = 1;
  if (sort === undefined) sort = "popular";
  console.log(subject);
  console.log(searchingBy);
  console.log(page);
  console.log(sort);
  let lectures = [];
  try {
    lectures = await Lecture.find({
      subject: { $regex: searchingBy, $options: "i" },
    }).sort({ sort: -1 });
    //sort랑 slice 가 안됐음
  } catch (error) {
    console.log(error);
  }
  res.send(lectures);
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password },
  } = req;
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
};

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
});

export const postKakaoLogIn = (req, res) => {
  res.redirect("http://localhost:3000");
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
  req.session.save();
};

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword },
  } = req;
  try {
    await req.user.changePassword(oldPassword, newPassword);
    // res.redirect(routes.me);
  } catch (error) {
    console.log(error);
    // res.render(routes.changePassword);
  }
};
