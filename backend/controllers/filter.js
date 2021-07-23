//파일이름 미정
import mongoose from "mongoose";
import lectureModel from "../models/Lecture";

const tryConvertToObjectId = async (str) => {
  if (!str) {
    return null;
  }
  try {
    let id = mongoose.Types.ObjectId(str);
    return id;
  } catch (err) {
    return null;
  }
};

const checkIsLectureExist = async (str) => {
  try {
    const id = await tryConvertToObjectId(str);
    if (!id) {
      return null;
    }
    //check if Connected-Lecture exist
    const query = { _id: id };
    const lecture = await lectureModel.findOne(query);
    if (lecture) {
      return id;
    } else return null;
  } catch (err) {
    return null;
  }
}

export const getArgs = async (req, res, list) => {
  let result = {};
  try {
    for (const info of list) {
      result[info.name] = info.filter
        ? await info.filter(req[info.path][info.name])
        : req[info.path][info.name];
      if (result[info.name] === null || result[info.name] === undefined) {
        res.status(400).json({
          msg: `Unvalid arguments '${info.path}.${info.name}' : ${req[info.path][info.name]}`,
        });
        return null;
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
  return result;
};

export const ARGUMENTS = {
  LECTUREID: {
    name: "lectureId",
    path: "query",
    filter: tryConvertToObjectId,
  },
  QNAID: {
    name: "QnAId",
    path: "query",
    filter: tryConvertToObjectId,
  },
  TARGETID: {
    name: "targetId",
    path: "query",
    filter: async (x) => {
      x *= 1;
      return isNaN(x) ? null : x;
    },
  },
  DATA: {
    name: "data",
    path: "body",
    filter: null,
  },
  DESCRIPTION: {
    name: "description",
    path: "body",
    filter: null,
  },
  CONNECTEDLECTUREID: {
    name: "connectedLectureId",
    path: "body",
    filter: checkIsLectureExist,
  },
};
