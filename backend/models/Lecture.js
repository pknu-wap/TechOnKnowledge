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
  recommandation: Number,
  epliogue: Array,
  connected_lecture: Array,
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
  imageSrc: String,
  time: Date, //작성시간 변수들 이름 통일하기
});

const model = mongoose.model("Lecture", LectureSchema);

export default model;
