import Lecture from "../models/Lecture";
import Recommend from "../models/Recommendation";
import Curriculum from "../models/Curriculum";
import { getArgs, ARGUMENTS } from "./filter";

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
    res.status(200).json(newLecture);
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

export const getLectureInfo = async (req, res) => {
  const args = await getArgs(req, res, [ARGUMENTS.LECTUREID]);
  if (!args) {
    return;
  }
  try {
    const query = { _id: args[ARGUMENTS.LECTUREID.name] };
    const select = { qna: 0, connected_lecture: 0, curriculum: 0, epliogue: 0 };
    const lecture = await Lecture.findOne(query, select).lean();
    if (!lecture) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    res.status(200).json({ msg: "Success", contents: lecture });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
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
