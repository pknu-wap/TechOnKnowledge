import multer from "multer";
import passport from "passport";

const multerImage = multer({ dest: "uploads/"});

export const uploadImage = multerImage.single("avatar")

export const auth = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.end();
    }
  })(req, res, next);
};

export const tryAuth = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};
