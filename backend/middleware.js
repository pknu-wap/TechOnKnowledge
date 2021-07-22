import passport from "passport";

export const auth = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (user) {
      req.user = user;
      next();
    }
    res.end();
  })(req, res, next);
};
