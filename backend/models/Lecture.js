import mongoose, { Schema } from "mongoose";

const LectureSchema = new mongoose.Schema({
  category: String,
  level: String,
  title: String,
  link: String,
  teacher: String,
  fee: Number,
  term: Number,
  explain: String,
  hash_tag: String,
  eplilogue: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  recommendation: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recommend",
    },
  ],
  connected_lecture: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },
  ],
  qna: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QnA",
    },
  ],
  curriculum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LectureId",
  },
});

const model = mongoose.model("Lecture", LectureSchema);

export default model;
