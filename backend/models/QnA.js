import mongoose from "mongoose";

const QnASchema = new mongoose.Schema({
  question: String,
  answer: Array,
  writerId: mongoose.Schema.Types.ObjectId,
  writeTime: Date,
});

const model = mongoose.model("QnA", QnASchema);

export default model;
