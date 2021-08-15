import Lecture from "../models/Lecture";
import Curriculum from "../models/Curriculum";
import { getArgs, ARGUMENTS } from "./filter";

export const search = async (req, res) => {
  let {
    params: { content: subject }, //title, teacher, hash tag
    query: { searchingBy, page, sort, category },
  } = req;
  if (searchingBy === undefined)
    res.status(400).send({ error: "검색어를 입력하세요" });
  else {
    if (page === undefined) page = 1;
    if (sort === undefined) sort = "recommend_count";
    if (category === undefined) category = "";
    const skip_number = (page - 1) * 9;
    const lectures_per_page = 9;
    let lectures = [];
    try {
      lectures = await Lecture.find({
        [subject]: { $regex: searchingBy, $options: "i" },
        category: { $regex: category },
      })
        .skip(skip_number)
        .limit(lectures_per_page)
        .sort({ [sort]: -1 });
      console.log(lectures);
    } catch (error) {
      console.log(error);
    }
    res.json({ lectures });
  }
};

export const getLecture = async (req, res) => {
  let {
    query: { category, page, sort },
  } = req;
  if (category === undefined) category = "";
  if (sort === undefined) sort = "recommend_count";
  if (page === undefined) page = 1;
  const skip_number = (page - 1) * 9;
  const lectures_per_page = 9;
  let lectures = [];
  try {
    lectures = await Lecture.find({ category: { $regex: category } })
      .skip(skip_number)
      .limit(lectures_per_page)
      .sort({ [sort]: -1 });
    res.json({ lectures });
  } catch (error) {
    console.log(error);
  }
};

export const getLectureInformation = async (req, res) => {
  const {
    query: { lectureId },
  } = req;
  const lecture = await Lecture.findById(lectureId);
  res.send(lecture);
};

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
      pic
    },
    file
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
    pic,
    // image: file ? file.path : "default image"
    image: file.path
  });
  newLecture.save((err) => {
    if (err) console.error("Oops! failed to save data...");
    else console.log("Data seved successfully!");
    res.status(200).json({msg: "Success"});
  });
  res.end();
};

function isRecommend(lecture, user){
  let isuser;
  for(let i=0;i<lecture.recommend_people.length;i++){
    if(user.id == lecture.recommend_people[i]){
      isuser = "user";
      break;
    }
  }
  return isuser;
}

export const postPlusRecommend = async (req, res) => {
  const {
    body: { lectureId },
    user,
  } = req;
  try {
    const lecture = await Lecture.findById(lectureId);
    if (lecture) {
      if(!isRecommend(lecture, req.user)) {
        lecture.recommend_people.push(user._id);
        lecture.recommend_count = lecture.recommend_people.length;
        lecture.save();
        console.log(lecture);
      }
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
    const lecture = await Lecture.findById(lectureId);
    if (lecture) {
      if(isRecommend(lecture, req.user)){
        await Lecture.updateOne(
          { _id: lectureId },
          { $pull: { recommend_people: user.id } }
        );
        lecture.recommend_count -= 1;
        lecture.save();
      }
    } else {
      res.error("error");
    }
    
  } catch (error) {
    console.log(error);
  }
  res.end();
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

export const modifyLecture = async (req, res) => {
  const {
    body: {
      lectureId,
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
  const lecture = await Lecture.findOneAndUpdate(
    { _id: lectureId },
    {
      category,
      level,
      title,
      link,
      teacher,
      fee,
      term,
      explain,
      hash_tag,
    }
  );
  lecture.save();
  res.end();
};
