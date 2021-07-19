import QnAModel from "../models/QnA";
import { tryConvertToObjectId } from "./filter";

export const postAnswer = async (req, res) => {
  const QnAId = tryConvertToObjectId(req.body.QnAId);
  let answer = req.body.answer;
  if (!QnAId || !answer) {
    //QnAId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
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
      author: req.user,
      createAt: new Date(),
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

export const putAnswer = async (req, res) => {
  const QnAId = tryConvertToObjectId(req.body.QnAId);
  let answer = req.body.answer;
  const id = req.body.targetId * 1;
  if (!QnAId || isNaN(id) || !answer) {
    return res.status(400).json({ msg: "Bad Request" });
  }

  try {
    const query = {
      _id: QnAId,
      answer: { $elemMatch: { id: id, author: req.user } },
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

export const deleteAnswer = async (req, res) => {
  const QnAId = tryConvertToObjectId(req.body.QnAId);
  const id = req.body.targetId * 1;
  if (!QnAId || isNaN(id)) {
    return res.status(400).json({ msg: "Bad Request" });
  }
  try {
    const query = { _id: QnAId };
    const update = {
      $pull: { answer: { id: id, author: req.user } },
    };
    const updateResult = await QnAModel.updateOne(query, update);
    if (!updateResult.n) {
      return res.status(404).json({ msg: "QnA Not Found" });
    }
    if (!updateResult.nModified) {
      return res.status(404).json({ msg: "Failure" });
    }
    res.status(200).json({ msg: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
