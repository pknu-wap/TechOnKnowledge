import lectureModel from "../models/Lecture";
import { parseObjectId, tryConvertToObjectId } from "./filter";

const argumentsCheck = async (url, description, lectureId) => {
  let desc = description ? description : null;
  let result = {
    connectedLectureId: parseObjectId(url),
    lectureId: tryConvertToObjectId(lectureId),
    description: desc,
    valid: false,
    error: false,
  };
  if (result.lectureId && result.connectedLectureId && result.description) {
    try {
      //check if Connected-Lecture exist
      const query = { _id: result.connectedLectureId };
      const lecture = await lectureModel.findOne(query);
      if (lecture) {
        result.valid = true;
      }
    } catch (err) {
      result.error = true;
      result.errorlog = err;
    }
  }
  return result;
};

//  /:lectureId
export const getConnectedLecture = async (req, res) => {
  const lectureId = tryConvertToObjectId(req.params.lectureId);
  try {
    const query = { _id: lectureId };
    const select = { connected_lecture: 1, _id: 0 };
    let documents = await lectureModel.findOne(query, select).lean();
    const length = documents.connected_lecture.length;
    //
    //documents 상태 : {connected_lecture: [connected_lecture documents...] }
    for (let i = 0; i < length; ++i) {
      let titleQuery = { _id: documents.connected_lecture[i].lectureId };
      let result = await lectureModel.findOne(titleQuery);
      documents.connected_lecture[i].lectureTitle = result.title;
    }
    res.status(200).json(documents.connected_lecture);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

//관련강의를 추가한다.
//
//URL 매개변수
//lectureId : 관련강의를 추가할 강좌 추천글의 ObjectId
//
//Body 매개변수
//url : 관련강의의 Url
//description : 관련강의에 대한 설명
export const postConnectedLecutre = async (req, res) => {
  const args = await argumentsCheck(
    req.body.url,
    req.body.description,
    req.params.lectureId
  );
  if (!args.valid) {
    return res.status(400).json({ msg: "Bad Request" });
  }
  if (args.error) {
    console.log(args.errorlog);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
  try {
    const aggregateQuery = [
      { $project: { connected_lecture: { $slice: ["$connected_lecture", -1] } } },
      { $match: { _id: args.lectureId } },
    ];
    const aggResult = await lectureModel.aggregate(aggregateQuery);
    if (aggResult.length === 0) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    let id = 0;
    if (aggResult[0].connected_lecture.length > 0) {
      id = aggResult[0].connected_lecture[0].id + 1;
    }
    const document = {
      id: id,
      lectureId: args.connectedLectureId,
      description: args.description,
      writerId: null,
      writeTime: new Date(),
      //TODO: 선행, 후행 이름 바꿀것
      recommendation_before: 0,
      recommendation_before_users: [],
      recommendation_after: 0,
      recommendation_after_users: [],
    };
    const query = { _id: args.lectureId };
    const update = { $push: { connected_lecture: document } };
    const result = await lectureModel.updateOne(query, update);
    if (!result.n) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    res.status(200).json({ msg: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

//관련강의를 수정한다.
//
//URL 매개변수
//lectureId : 관련강의를 수정할 강좌 추천글의 ObjectId
//targetId : 수정할 관련강의의 id
//
//Body 매개변수
//url : 관련강의의 Url
//description : 관련강의에 대한 설명
export const putConnectedLecture = async (req, res) => {
  const args = await argumentsCheck(
    req.body.url,
    req.body.description,
    req.params.lectureId
  );
  const targetId = req.params.targetId * 1;
  if (!args.valid || isNaN(targetId)) {
    return res.status(400).json({ msg: "Bad Request" });
  }
  if (args.error) {
    console.log(args.errorlog);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
  try {
    const query = {
      _id: args.lectureId,
      connected_lecture: { $elemMatch: { id: targetId, writerId: null } },
    };
    const update = {
      $set: {
        "connected_lecture.$.lectureId": args.connectedLectureId,
        "connected_lecture.$.description": args.description,
      },
    };
    const result = await lectureModel.updateOne(query, update);
    if (!result.n) {
      return res.status(404).json({ msg: "failure" });
    }
    res.status(200).json({ msg: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

//관련강의를 삭제한다.
//
//URL 매개변수
//lectureId : 관련강의를 삭제할 강좌 추천글의 ObjectId
//targetId : 삭제할 관련강의의 id
//
//Body 매개변수
//
export const deleteConnectedLecture = async (req, res) => {
  const lectureId = tryConvertToObjectId(req.params.lectureId);
  const targetId = req.params.targetId * 1;
  if (!lectureId || isNaN(targetId)) {
    return res.status(400).json({ msg: "Bad Request" });
  }

  try {
    const query = { _id: lectureId };
    const update = {
      $pull: {
        connected_lecture: {
          id: targetId,
          writerId: null,
        },
      },
    };
    const result = await lectureModel.updateOne(query, update);
    if (!result.n) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    if (!result.nModified) {
      //삭제 실패
      return res.status(400).json({ msg: "Failure" });
    }
    res.status(200).json({ msg: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const recommendationBefore = async (req, res) => {

};

export const recommendationAfter = async (req, res) => {

};