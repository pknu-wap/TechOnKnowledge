import lectureModel from "../models/Lecture";
import QnAModel from "../models/QnA";
import { tryConvertToObjectId } from "./filter";

export const getQuestion = async (req, res) => {
  const lectureId = tryConvertToObjectId(req.body.lectureId);
  if (!lectureId) {
    //lectureId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }
  try {
    const lectureFindQuery = { _id: lectureId };
    const lecture = await lectureModel.findOne(lectureFindQuery).lean();
    if (!lecture) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    const qnaFindQuery = { _id: { $in: lecture.qna } };
    const qna = await QnAModel.find(qnaFindQuery).lean();
    res.status(200).json(qna);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const postQuestion = async (req, res) => {
  const lectureId = tryConvertToObjectId(req.body.lectureId);
  let question = req.body.question;
  if (!lectureId || !question) {
    return res.status(400).json({ msg: "Bad Request" });
  }

  const document = new QnAModel({
    question: question,
    author: req.user,
    answer: [],
  });

  try {
    const query = { _id: lectureId };
    const update = { $push: { qna: document._id } };
    const result = await lectureModel.updateOne(query, update).lean();
    if (!result) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    await document.save();
    res.status(200).json({ msg: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const putQuestion = async (req, res) => {
  const QnAId = tryConvertToObjectId(req.body.QnAId);
  let newQuestion = req.body.question;
  if (!QnAId || !newQuestion) {
    return res.status(400).json({ msg: "Bad Request" });
  }

  try {
    const query = { _id: QnAId, author: req.user };
    const update = { $set: { question: newQuestion } };
    const result = await QnAModel.updateOne(query, update).lean();
    if (result.n) {
      res.status(200).json({ msg: "Success" });
    } else {
      res.status(404).json({ msg: "Failure" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteQuestion = async (req, res) => {
  const QnAId = tryConvertToObjectId(req.body.QnAId);
  if (!QnAId) {
    //QnAId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }

  try {
    const QnAQuery = { _id: QnAId };
    const lectureQuery = { qna: QnAId };
    const lectureUpdate = { $pull: { qna: QnAId } };
    const QnADocument = await QnAModel.findOne(QnAQuery);
    if (!QnADocument) {
      //QnAId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "QnA Not Found" });
    }
    if (QnADocument.author != req.user) {
      return res.status(400).json({ msg: "Author Info Unmatch" });
    }
    await QnADocument.remove();
    const updateResult = await lectureModel
      .updateOne(lectureQuery, lectureUpdate)
      .exec();
    if (!updateResult) {
      // lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    res.status(200).json({ msg: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
