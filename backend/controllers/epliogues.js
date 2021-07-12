import lectureModel from "../models/Lecture";
import { tryConvertToObjectId } from "./filter";

//get /:lectureId
//후기 목록을 배열 형태로 반환한다.
//
//URL 매개변수
//lectureId : 후기 목록을 가져올 추천 강의글의 ObjectId
//
//Body 매개변수
//
export const getEpliogue = (req, res) => {
  const lectureId = tryConvertToObjectId(req.params.lectureId);
  if (!lectureId) {
    //lectureId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }
  lectureModel
    .findOne({ _id: lectureId })
    .exec()
    .then((result) => {
      return res.status(200).json(result.Epliogue);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error" });
    });
};

//post  /:lectureId
//후기를 추가한다.
//
//URL 매개변수
//lectureId : 후기를 추가(작성)할 추천 강의글의 ObjectId
//
//Body 매개변수
//data : 후기 내용(string)
export const postEpliogue = (req, res) => {
  //TODO : 유저 인증 추가
  const lectureId = tryConvertToObjectId(req.params.lectureId);
  if (!lectureId) {
    //lectureId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }
  let data = req.body.data;
  if (!data) {
    return res.status(400).json({ msg: "arguments 'data' is undefined" });
  }

  //Query 내용 : lectureId에 매핑되는 Documents에서 Epliogue의 마지막 element만 가져옴
  const aggregateQuery = [
    { $project: { Epliogue: { $slice: ["$Epliogue", -1] } } },
    { $match: { _id: lectureId } },
  ];

  lectureModel
    .aggregate(aggregateQuery)
    .then((result) => {
      if (result.length === 0) {
        //lectureId에 매핑되는 Document가 없음
        res.status(404).json({ msg: "Lecture Not Found" });
        throw 0; //to break promise chain
      }
      let id = 0;
      if (result[0].Epliogue.length > 0) {
        id = result[0].Epliogue[0].id + 1;
      }
      const epliogue = {
        value: data,
        id: id,
      };
      const query = { _id: lectureId };
      const update = {
        $push: {
          Epliogue: epliogue,
        },
      };
      //Epliogue post 수행
      return lectureModel.updateOne(query, update).exec();
    })
    .then((updateResult) => {
      if (!updateResult.n) {
        //lectureId에 매핑되는 Document가 없음
        return res.status(404).json({ msg: "Lecture Not Found" });
      }
      res.status(200).json({ msg: "Success" });
    })
    .catch((err) => {
      if (err === 0) {
        return;
      }
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error" });
    });
};

//delete  /:lectureId/:epliogueId
//후기를 삭제한다.
//
//URL 매개변수
//lectureId : 후기를 삭제할 추천 강의글의 ObjectId
//epliogueId : 삭제될 후기의 id
//
//Body 매개변수
//
export const deleteEpliogue = (req, res) => {
  const lectureId = tryConvertToObjectId(req.params.lectureId);
  if (!lectureId) {
    //lectureId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }

  const query = {
    _id: lectureId,
  };
  const update = {
    $pull: {
      Epliogue: {
        id: req.params.epliogueId * 1,
      },
    },
  };
  lectureModel
    .updateOne(query, update)
    .exec()
    .then((updateResult) => {
      if (!updateResult.n) {
        //lectureId에 매핑되는 Document가 없음
        return res.status(404).json({ msg: "Lecture Not Found" });
      }
      if (!updateResult.nModified) {
        //epliogueId에 매핑되는 Epliogue가 없음
        return res.status(404).json({ msg: "Epliogue Not Found" });
      }
      res.status(200).json({ msg: "Success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error" });
    });
};

//put /:lectureId/:epliogueId
//후기를 수정한다.
//
//URL 매개변수
//lectureId : 후기를 수정할 추천 강의글의 ObjectId
//epliogueId : 수정할 후기의 id
//
//Body 매개변수
//data : 새로운 후기의 내용(string)
export const putEpliogue = (req, res) => {
  const lectureId = tryConvertToObjectId(req.params.lectureId);
  if (!lectureId) {
    //lectureId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }

  let data = req.body.data;
  if (!data) {
    return res.status(400).json({ msg: "arguments 'data' is undefined" });
  }

  const query = {
    _id: lectureId,
    "Epliogue.id": req.params.epliogueId * 1,
  };
  const update = {
    $set: {
      "Epliogue.$.value": data,
    },
  };
  lectureModel
    .updateOne(query, update)
    .exec()
    .then((updateResult) => {
      console.log(updateResult);
      if (!updateResult.n) {
        //lectureId에 매핑되는 Document가 없거나, epliogueId가 Epliogue 배열에 존재하지 않음
        return res.status(404).json({ msg: "Lecture or Epliogue Not Found" });
      }
      res.status(200).json({ msg: "Success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error" });
    });
};
