import passport from "passport";
import User from "../models/User";
import jwt from "jsonwebtoken";
import Lecture from "../models/Lecture";
import bcrypt from "bcrypt";
import routes from "../routes";

export const search = async (req, res) => {
  //미완성
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
    body: { email, password },
  } = req;
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({
        email: "해당 이메일을 가진 사용자가 존재합니다.",
      });
    } else {
      const newUser = new User({
        email,
        password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
};

export const postLogin = async (req, res, next) => {
  console.log("postLogin");
  try {
    // 아까 local로 등록한 인증과정 실행
    passport.authenticate("local", (passportError, user, info) => {
      // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
      if (passportError || !user) {
        res.status(400).json({ message: info.reason });
        return;
      }
      // user데이터를 통해 로그인 진행
      req.login(user, { session: false }, (loginError) => {
        if (loginError) {
          res.send(loginError);
          return;
        }
        // 클라이언트에게 JWT생성 후 반환
        console.log(user.id);
        console.log(user.email);
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET
        );
        res.json({ token });
      });
    })(req, res);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

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
  console.log(req.user);
  req.logout();
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
