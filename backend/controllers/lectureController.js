import Lecture from "../models/Lecture";
import Curriculum from "../models/Curriculum";

export const postUploadLecture = async (req, res) => {
  const {
    body: {
      category,
      level,
      title,
      link,
      teacher,
      fee,
      term,
      explain,
      hash_tag,
      recommandation,
      epilogue,
    },
  } = req;
  const newLecture = await Lecture.create({
    category,
    level,
    title,
    link,
    teacher,
    fee,
    term,
    explain,
    hash_tag,
    recommandation,
    epilogue,
  });
  newLecture.save((err) => {
    if (err) console.error("Oops! failed to save data...");
    else console.log("Data seved successfully!");
  });
};

export const postRecommend = (req, res) => {
  const {
    body: { lectureId, userId },
  } = req;
  console.log(lectureId);
  console.log(userId);
  res.send("recommend");
};

export const postAddCurriculum = async (req, res) => {
  const {
    body: { targetId },
  } = req;
  const newCurriculum = await Curriculum(targetId);
  newCurriculum.save((err) => {
    if (err) console.error("failed to save curriculum data");
    else console.log("curriculum data is saved");
  });
};
