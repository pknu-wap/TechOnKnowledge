import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
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

const model = mongoose.model("User", UserSchema);

export default model;
