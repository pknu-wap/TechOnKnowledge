import QnAModel from "../models/QnA";
import { tryConvertToObjectId } from "./filter";

//post  /:QnAId
//QnA 질문에 답변을 등록한다.
//
//URL 매개변수
//QnAId : 답변을 등록할 질문(QnA)의 ObjectId
//
//Body 매개변수
//answer : 답변 내용(string)
export const postAnswer = (req, res) => {
  //TODO : 유저 인증 추가

  const QnAId = tryConvertToObjectId(req.params.QnAId);
  if (!QnAId) {
    //QnAId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }

  let answer = req.body.answer;
  if (!answer) {
    return res.status(400).json({ msg: "arguments 'answer' is undefined" });
  }

  const query = { _id: QnAId };
  QnAModel.findOne(query)
    .exec()
    .then((data) => {
      if (!data) {
        //QnAId에 매핑되는 Document가 없음
        return res.status(404).json({ msg: "QnA Not Found" });
      }
      if (data.answer) {
        //Document에 이미 answer가 존재함
        return res
          .status(400)
          .json({ msg: "Answer is already exist, use Put method" });
      }
      data.answer = answer;
      data.save();
      res.status(200).json({ msg: "Success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error" });
    });
};

//put  /:QnAId
//QnA 답변을 수정한다.
//
//URL 매개변수
//QnAId : 답변을 수정할 질문(QnA)의 ObjectId
//
//Body 매개변수
//answer : 변경할 답변 내용(string)
export const putAnswer = (req, res) => {
  //TODO : 유저 인증 추가

  const QnAId = tryConvertToObjectId(req.params.QnAId);
  if (!QnAId) {
    //QnAId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }

  let newAnswer = req.body.answer;
  if (!newAnswer) {
    return res.status(400).json({ msg: "arguments 'answer' is undefined" });
  }

  const query = { _id: QnAId };
  QnAModel.findOne(query)
    .exec()
    .then((data) => {
      if (!data) {
        //QnAId에 매핑되는 Document가 없음
        return res.status(404).json({ msg: "QnA Not Found" });
      }
      if (!data.answer) {
        //Document에 answer가 존재하지 않음
        return res
          .status(400)
          .json({ msg: "Answer is not exist, use Post method" });
      }
      data.answer = newAnswer;
      data.save();
      res.status(200).json({ msg: "Success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error" });
    });
};

//delete  /:QnAId
//QnA 답변을 삭제한다.
//
//URL 매개변수
//QnAId : 답변을 삭제할 질문(QnA)의 ObjectId
//
//Body 매개변수
//
export const deleteAnswer = (req, res) => {
  //TODO : 유저 인증 추가

  const QnAId = tryConvertToObjectId(req.params.QnAId);
  if (!QnAId) {
    //QnAId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }

  const query = { _id: QnAId };
  QnAModel.findOne(query)
    .exec()
    .then((data) => {
      if (!data) {
        //QnAId에 매핑되는 Document가 없음
        return res.status(404).json({ msg: "QnA Not Found" });
      }
      if (!data.answer) {
        //Document에 answer가 존재하지 않음
        return res.status(400).json({ msg: "Answer is not exist" });
      }
      data.answer = null;
      data.save();
      res.status(200).json({ msg: "Success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error" });
    });
};
