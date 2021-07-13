import QnAModel from "../models/QnA";
import { tryConvertToObjectId } from "./filter";

//QnA 질문에 답변을 등록한다.
//
//URL 매개변수
//QnAId : 답변을 등록할 질문(QnA)의 ObjectId
//
//Body 매개변수
//answer : 답변 내용(string)
export const postAnswer = async (req, res) => {
  const QnAId = tryConvertToObjectId(req.params.QnAId);
  if (!QnAId) {
    //QnAId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }

  let answer = req.body.answer;
  if (!answer) {
    return res.status(400).json({ msg: "arguments 'answer' is undefined" });
  }

  try {
    const aggregateQuery = [
      { $project: { answer: { $slice: ["$answer", -1] } } },
      { $match: { _id: QnAId } },
    ];
    const aggResult = await QnAModel.aggregate(aggregateQuery);
    if (aggResult.length === 0) {
      return res.status(404).json({ msg: "QnA Not Found" });
    }
    let id = 0;
    if (aggResult[0].answer.length > 0) {
      id = aggResult[0].answer[0].id + 1;
    }
    const document = {
      writerId: null,
      writeTime: new Date(),
      value: answer,
      id: id,
    };
    const query = { _id: QnAId };
    const update = { $push: { answer: document } };
    const updateResult = await QnAModel.updateOne(query, update);
    if (!updateResult.n) {
      return res.status(404).json({ msg: "QnA Not Found" });
    }
    res.status(200).json({ msg: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

//QnA 답변을 수정한다.
//
//URL 매개변수
//QnAId : 답변을 수정할 질문(QnA)의 ObjectId
//targetId : 수정할 답변의 id
//
//Body 매개변수
//answer : 변경할 답변 내용(string)
export const putAnswer = async (req, res) => {
  const QnAId = tryConvertToObjectId(req.params.QnAId);
  const id = req.params.targetId * 1;
  if (!QnAId || isNaN(id)) {
    return res.status(400).json({ msg: "Bad Request" });
  }

  let answer = req.body.answer;
  if (!answer) {
    return res.status(400).json({ msg: "arguments 'answer' is undefined" });
  }
  try {
    const query = {
      _id: QnAId,
      "answer.id": id,
      "answer.writerId": null,
    };
    const update = { $set: { "answer.$.value": answer } };
    const updateResult = await QnAModel.updateOne(query, update);
    if (!updateResult.n) {
      return res.status(404).json({ msg: "Failure" });
    }
    res.status(200).json({ msg: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

//QnA 답변을 삭제한다.
//
//URL 매개변수
//QnAId : 답변을 삭제할 질문(QnA)의 ObjectId
//targetId : 삭제할 답변의 id
//
//Body 매개변수
//
export const deleteAnswer = async (req, res) => {
  const QnAId = tryConvertToObjectId(req.params.QnAId);
  const id = req.params.targetId * 1;
  if (!QnAId || isNaN(id)) {
    return res.status(400).json({ msg: "Bad Request" });
  }
  try {
    const query = { _id: QnAId };
    const update = {
      $pull: { answer: { id: id, writerId: null } },
    };
    const updateResult = await QnAModel.updateOne(query, update);
    if (!updateResult.n) {
      return res.status(404).json({ msg: "Failure" });
    }
    res.status(200).json({ msg: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
