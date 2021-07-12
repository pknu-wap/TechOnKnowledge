import lectureModel from "../models/lecture";
import { tryConvertToObjectId } from "./filter";

//post  /:lectureId
//관련강의를 추가한다.
//
//URL 매개변수
//lectureId : 관련강의를 추가할 강좌 추천글의 ObjectId
//
//Body 매개변수
//connectedLectureId : 관련강의의 ObjectId
export const postConnectedLecutre = (req, res) => {
  const lectureId = tryConvertToObjectId(req.params.lectureId);
  const connectedLectureId = tryConvertToObjectId(req.body.connectedLectureId);
  if (!lectureId || !connectedLectureId) {
    //lectureId 또는 connectedLectureId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }
  const query = {
    _id: lectureId,
  };
  const update = {
    $addToSet: {
      Connected_lecture: connectedLectureId,
    },
  };
  lectureModel
    .updateOne(query, update)
    .then((result) => {
      if (!result.n) {
        //lectureId에 매핑되는 Document가 없음
        return res.status(404).json({ msg: "Lecture Not Found" });
      }
      if (!result.nModified) {
        //connectedLectureId가 이미 Connected_lecture 배열에 포함되있는 경우
        return res.status(400).json({ msg: "already exists" });
      }
      res.status(200).json({ msg: "success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error" });
    });
};

//put /:lectureId/:targetId
//관련강의를 수정한다.
//
//URL 매개변수
//lectureId : 관련강의를 수정할 강좌 추천글의 ObjectId
//targetId : 수정할 관련강의의 ObjectId
//
//Body 매개변수
//connectedLectureId : 변경될 값(관련강의의 ObjectId)
export const putConnectedLecture = (req, res) => {
  const lectureId = tryConvertToObjectId(req.params.lectureId);
  const targetId = tryConvertToObjectId(req.params.targetId);
  const connectedLectureId = tryConvertToObjectId(req.body.connectedLectureId);
  if (!lectureId || !targetId || !connectedLectureId) {
    //lectureId 또는 connectedLectureId 또는 targetId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }
  //TODO : 중복제거 추가
  const query = {
    _id: lectureId,
  };
  let update = {
    $pull: {
      Connected_lecture: targetId,
    },
  };
  lectureModel
    .updateOne(query, update)
    .then((result) => {
      if (!result.n) {
        //lectureId에 매핑되는 Document가 없음
        res.status(404).json({ msg: "Lecture Not Found" });
        throw 0;
      }
      if (!result.nModified) {
        //targetId를 Connected_lecture 배열에서 제거하지 못함(찾지 못함)
        res.status(404).json({ msg: "Connected_lecture Not Found" });
        throw 0;
      }
      update = {
        $addToSet: {
          Connected_lecture: connectedLectureId,
        },
      };
      return lectureModel.updateOne(query, update);
    })
    .then((result) => {
      if (!result.n) {
        //lectureId에 매핑되는 Document가 없음
        res.status(404).json({ msg: "Lecture Not Found" });
        return;
      }
      res.status(200).json({ msg: "success" });
    })
    .catch((err) => {
      if (err === 0) {
        return;
      }
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error" });
    });
};

//delete  /:lectureId/:targetId
//관련강의를 삭제한다.
//
//URL 매개변수
//lectureId : 관련강의를 삭제할 강좌 추천글의 ObjectId
//targetId : 삭제할 관련강의의 ObjectId
//
//Body 매개변수
//
export const deleteConnectedLecture = (req, res) => {
  const lectureId = tryConvertToObjectId(req.params.lectureId);
  const targetId = tryConvertToObjectId(req.params.targetId);
  if (!lectureId || !targetId) {
    //lectureId 또는 targetId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }
  const query = {
    _id: lectureId,
  };
  const update = {
    $pull: {
      Connected_lecture: targetId,
    },
  };
  lectureModel
    .updateOne(query, update)
    .then((result) => {
      if (!result.n) {
        //lectureId에 매핑되는 Document가 없음
        return res.status(404).json({ msg: "Lecture Not Found" });
      }
      if (!result.nModified) {
        //targetId를 Connected_lecture 배열에서 제거하지 못함(찾지 못함)
        return res.status(400).json({ msg: "Connected_lecture Not Found" });
      }
      res.status(200).json({ msg: "success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error" });
    });
};
