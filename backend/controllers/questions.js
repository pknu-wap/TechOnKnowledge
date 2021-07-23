import lectureModel from "../models/Lecture";
import QnAModel from "../models/QnA";
import { getArgs, ARGUMENTS } from "./filter";

export const getQuestion = async (req, res) => {
  const args = await getArgs(req, res, [ARGUMENTS.LECTUREID]);
  if (!args) {
    return;
  }
  try {
    const lectureFindQuery = { _id: args[ARGUMENTS.LECTUREID.name] };
    const lecture = await lectureModel.findOne(lectureFindQuery).lean();
    if (!lecture) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    const qnaFindQuery = { _id: { $in: lecture.qna } };
    const qna = await QnAModel.find(qnaFindQuery).lean();
    res.status(200).json({ msg: "Success", contents: qna });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const postQuestion = async (req, res) => {
  const userId = req.user._id;
  const args = await getArgs(req, res, [ARGUMENTS.LECTUREID, ARGUMENTS.DATA]);
  if (!args) {
    return;
  }

  const document = new QnAModel({
    question: args[ARGUMENTS.DATA.name],
    author: userId,
    answer: [],
  });

  try {
    const query = { _id: args[ARGUMENTS.LECTUREID.name] };
    const update = { $push: { qna: document._id } };
    const result = await lectureModel.updateOne(query, update).lean();
    if (!result) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    await document.save();
    res.status(201).json({ msg: "Success", contentsId: document._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const putQuestion = async (req, res) => {
  const userId = req.user._id;
  const args = await getArgs(req, res, [ARGUMENTS.QNAID, ARGUMENTS.DATA]);
  if (!args) {
    return;
  }

  try {
    const query = { _id: args[ARGUMENTS.QNAID.name], author: userId };
    const update = { $set: { question: args[ARGUMENTS.DATA.name] } };
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
  const userId = req.user._id;
  const args = await getArgs(req, res, [ARGUMENTS.QNAID]);
  if (!args) {
    return;
  }

  try {
    const QnAQuery = { _id: args[ARGUMENTS.QNAID.name] };
    const lectureQuery = { qna: args[ARGUMENTS.QNAID.name] };
    const lectureUpdate = { $pull: { qna: args[ARGUMENTS.QNAID.name] } };
    const QnADocument = await QnAModel.findOne(QnAQuery);
    if (!QnADocument) {
      //QnAId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "QnA Not Found" });
    }
    if (String(QnADocument.author) != String(userId)) {
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
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
