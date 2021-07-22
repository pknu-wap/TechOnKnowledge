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
    lecture_creator: req.user.id,
  });
  newLecture.save((err) => {
    if (err) console.error("Oops! failed to save data...");
    else console.log("Data seved successfully!");
  });
  res.end();
};

export const postPlusRecommend = async (req, res) => {
  const {
    body: { lectureId },
    user,
  } = req;
  try {
    const lecture = await Lecture.findById(lectureId);
    if (lecture) {
      lecture.recommend_people.push(user.id);
      lecture.recommend_count = lecture.recommend_people.length;
      lecture.save();
    }
  } catch (error) {
    console.log(error);
  }
  res.end();
};

export const postMinusRecommend = async (req, res) => {
  const {
    body: { lectureId },
    user,
  } = req;
  try {
    await Lecture.updateOne(
      { _id: lectureId },
      { $pull: { recommend_people: user.id } }
    );
    const lecture = await Lecture.findById(lectureId);
    if (lecture) {
      lecture.recommend_count = lecture.recommend_people.length;
      console.log(lecture);
      lecture.save();
    } else {
      res.error("error");
    }
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
