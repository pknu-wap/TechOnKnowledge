import passport from "passport";

export const auth = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    console.log(user);
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};
