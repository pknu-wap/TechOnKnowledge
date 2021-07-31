import mongoose from "mongoose";

const LectureSchema = new mongoose.Schema({
  category: String,
  level: String,
  title: String,
  link: String,
  teacher: String,
  fee: Number,
  term: Number,
  explain: String,
  hash_tag: Array,
  epliogue: {
    type: Array,
    default: [],
  },
  lecture_creator: mongoose.Schema.Types.ObjectId,
  connected_lecture: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  recommend_count: {
    type: Number,
    default: 0,
  },
  recommend_people: [
    {
      type: mongoose.Schema.Types.ObjectId,
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
