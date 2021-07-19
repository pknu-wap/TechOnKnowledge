import mongoose from "mongoose";

const QnASchema = new mongoose.Schema({
  question: String,
  answer: Array,
  author: mongoose.Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const model = mongoose.model("QnA", QnASchema);

export default model;
