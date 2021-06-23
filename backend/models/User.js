import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  kakaoId: Number,
  naverId: Number,
  interesting_category: String,
  inclass: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lecture",
    },
  ],
  interesting_class: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lecture",
    },
  ],
  complete_class: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lecture",
    },
  ],
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const model = mongoose.model("User", UserSchema);

export default model;
