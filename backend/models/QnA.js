import mongoose from "mongoose";

const QnASchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const model = mongoose.model("QnA", QnASchema);

export default model;
