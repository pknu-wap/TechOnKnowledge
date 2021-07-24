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
    for (const argType of list) {
      const { name, field, filter, failedMsg } = argType;
      result[name] = filter ? await filter(req[field][name]) : req[field][name];
      if (result[name] === null || result[name] === undefined) {
        const defaultMsg = `Unvalid arguments {${field}.${name} : ${req[field][name]}}`;
        const msg = failedMsg ? `${defaultMsg} : ${failedMsg}` : defaultMsg;
        res.status(400).json({ msg: msg });
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
    field: "query",
    filter: tryConvertToObjectId,
  },
  QNAID: {
    name: "QnAId",
    field: "query",
    filter: tryConvertToObjectId,
  },
  TARGETID: {
    name: "targetId",
    field: "query",
    filter: async (x) => {
      x *= 1;
      return isNaN(x) ? null : x;
    },
  },
  DATA: {
    name: "data",
    field: "body",
    filter: null,
  },
  DESCRIPTION: {
    name: "description",
    field: "body",
    filter: null,
  },
  CONNECTEDLECTUREID: {
    name: "connectedLectureId",
    field: "body",
    filter: checkIsLectureExist,
  },
};
