import passport, { deserializeUser } from "passport";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const passwordEncryption = (user, pw) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(pw, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      user
        .save()
        .then((user) => console.log(user))
        .catch((err) => console.log(err));
    });
  });
}

export const postJoin = async (req, res, next) => {
  const {
    body: { email, password },
  } = req;
  try{
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
  
        passwordEncryption(newUser, password);
        res.json("Success");
      }
    });
  } catch(error){
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

function issuedToken(user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1 day",
  });
  return token;
}

export const postLogin = async (req, res, next) => {
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
        const token = issuedToken(user);
        res.json({ token });
      });
    })(req, res);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const postKakaoLogIn = (req, res) => {
  const { user } = req;
  const token = issuedToken(user);
  res.json({ token });
};

export const kakaoLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, email },
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
      kakaoId: id,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const kakaoLogin = passport.authenticate("kakao");

export const postChangePassword = async (req, res) => {
  const {
    body: { newPassword },
  } = req;
  try {
    passwordEncryption(req.user, newPassword);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
  res.json("end");
};
