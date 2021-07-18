import Lecture from "../models/Lecture";
import Curriculum from "../models/Curriculum";
import { tryConvertToObjectId } from "./filter";

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
  //req.params.lectureId가 undefined로 넘어오는 문제가 있음
  //app.use()에서의 :lectureId 정의가 안통하는것으로 추측됨, 정확한 원인 찾아내거나 :lectureId를 lectureRouter.js의 .get() 매개변수에 포함되도록 변경할것
  //일단 임시로 body.lectureId 사용
  const lectureId = tryConvertToObjectId(req.body.lectureId);
  if (!lectureId) {
    //lectureId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }
  try {
    const query = { _id: lectureId };
    const select = { qna: 0, connected_lecture: 0, curriculum: 0, epliogue: 0 };
    const lecture = await Lecture.findOne(query, select).lean();
    if (!lecture) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    res.status(200).json(lecture);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
