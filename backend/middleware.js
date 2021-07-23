import passport from "passport";

export const auth = async (req, res, next) => {
  console.log("auth" + req);
  passport.authenticate("jwt", { session: false }, (error, user) => {
    console.log(user);
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};

//auth가 필수로 요구되는 controller용 미들웨어, 단순히 req.user가 유효한지 검사
export const checkAuth = async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ msg: "Auth Failed" });
  }
};
