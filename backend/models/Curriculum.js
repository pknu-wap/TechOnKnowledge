import mongoose from "mongoose";

const curriculumSchema = new mongoose.Schema({
  lectureId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LectureId",
    },
  ],
});

const model = mongoose.model("Curriculum", curriculumSchema);

export default model;
