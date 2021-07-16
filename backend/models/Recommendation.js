import mongoose from "mongoose";

const RecommendSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
  recommend_person: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "who recommend lecture",
    },
  ],
});

const model = mongoose.model("Recommend", RecommendSchema);

export default model;
