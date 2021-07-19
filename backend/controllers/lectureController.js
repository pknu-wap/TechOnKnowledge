import Lecture from "../models/Lecture";
import Recommend from "../models/Recommendation";
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
  });
  newLecture.save((err) => {
    if (err) console.error("Oops! failed to save data...");
    else console.log("Data seved successfully!");
  });
};

export const postRecommend = async (req, res) => {  //미완성
  const {
    body: { lectureId, userId },
  } = req;
  console.log(lectureId);
  console.log(userId);
  try {
    const lecture = await Lecture.findById(lectureId).populate(
      "recommendation"
    );
    console.log(lecture.recommendation);
  } catch (error) {
    console.log(error);
  }
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

// if (lecture === undefined) {
//   const newRecommend = await Recommend.create({
//     recommend_person: userId,
//   });
//   // newRecommend.save((err) => {
//   //   if (err) console.log("fail to save recommend");
//   // });
//   Lecture.findOneAndUpdate(
//     { _id: lectureId },
//     { $push: { recommendation: newRecommend.id } },
//     (err, doc) => {
//       if (err) {
//         console.log(err);
//       }
//       console.log(doc);
//     }
//   );
// }
