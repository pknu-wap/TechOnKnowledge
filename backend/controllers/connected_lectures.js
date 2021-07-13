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

//get
export const getConnectedLecture = async (req, res) => {

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
  if (!args.error) {
    console.log(args.errorlog);
    res.status(500).json({ msg: "Internal Server Error" });
  }
  try {
    const document = {
      id: 0, //TODO: id 정하는 부분 구현(model에 id저장하는 형태 또는 epliogue에서 사용한 array 마지막 원소값 사용하는 형태)
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
  if (!args.valid || !targetId) {
    return res.status(400).json({ msg: "Bad Request" });
  }
  if (!args.error) {
    console.log(args.errorlog);
    res.status(500).json({ msg: "Internal Server Error" });
  }
  try {
    const query = {
      _id: args.lectureId,
      "connected_lecture.id": targetId,
      "connected_lecture.writerId": null,
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
  const id = req.params.targetId * 1;
  if (!lectureId || !id) {
    return res.status(400).json({ msg: "Bad Request" });
  }

  try {
    const query = { _id: lectureId };
    const update = {
      $pull: {
        connected_lecture: {
          id: id,
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