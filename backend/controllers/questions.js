import lectureModel from "../models/Lecture";
import QnAModel from "../models/QnA";
import { tryConvertToObjectId } from "./filter";

//lectureId에 대응되는 모든 QnA 반환
//
//URL 매개변수
//lectureId : QnA 목록을 가져올 추천 강의글의 ObjectId
//
//Body 매개변수
//
export const getQuestion = async (req, res) => {
  // const lectureId = tryConvertToObjectId(req.params.lectureId);
  // if (!lectureId) {
  //   //lectureId가 유효하지 않은 형식(ObjectId로 변환 불가능)
  //   return res.status(400).json({ msg: "Bad Request" });
  // }

  // lectureModel
  //   .findOne({ _id: lectureId })
  //   .exec()
  //   .then((result) => {
  //     if (!result) {
  //       //lectureId에 매핑되는 Document가 없음
  //       return res.status(404).json({ msg: "Lecture Not Found" });
  //     }
  //     const query = { _id: { $in: result.QnA } };
  //     return QnAModel.find(query);
  //   })
  //   .then((result) => {
  //     res.status(200).json(result);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).json({ msg: "Internal Server Error" });
  //   });

  const lectureId = tryConvertToObjectId(req.params.lectureId);
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

//질문을 추가(작성)한다.
//
//URL 매개변수
//lectureId : 질문을 추가 할 추천 강의글의 ObjectId
//
//Body 매개변수
//question : 질문 내용(string)
export const postQuestion = async (req, res) => {
  //TODO : 유저 인증 추가

  // const lectureId = tryConvertToObjectId(req.params.lectureId);
  // if (!lectureId) {
  //   //lectureId가 유효하지 않은 형식(ObjectId로 변환 불가능)
  //   return res.status(400).json({ msg: "Bad Request" });
  // }

  // let question = req.body.question;
  // if (!question) {
  //   return res.status(400).json({ msg: "arguments 'question' is undefined" });
  // }

  // const document = new QnAModel({
  //   question: question,
  //   writerId: null,
  //   answer: null,
  // });

  // const query = { _id: lectureId };
  // const update = { $push: { QnA: document._id } };
  // lectureModel
  //   .updateOne(query, update)
  //   .exec()
  //   .then((result) => {
  //     //lectureId에 매핑되는 Document가 없음
  //     if (!result) return res.status(404).json({ msg: "Lecture Not Found" });
  //     document.save();
  //     res.status(200).json({ msg: "Success" });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).json({ msg: "Internal Server Error" });
  //   });

  const lectureId = tryConvertToObjectId(req.params.lectureId);
  if (!lectureId) {
    //lectureId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }

  let question = req.body.question;
  if (!question) {
    return res.status(400).json({ msg: "arguments 'question' is undefined" });
  }

  const document = new QnAModel({
    question: question,
    writerId: null,
    answer: [],
    writeTime: new Date(),
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

//질문을 수정한다.
//
//URL 매개변수
//QnAId : 수정할 질문(QnA)의 ObjectId
//
//Body 매개변수
//question : 변경할 질문 내용(string)
export const putQuestion = async (req, res) => {
  //TODO : 유저 인증 추가

  // const QnAId = tryConvertToObjectId(req.params.QnAId);
  // if (!QnAId) {
  //   //QnAId가 유효하지 않은 형식(ObjectId로 변환 불가능)
  //   return res.status(400).json({ msg: "Bad Request" });
  // }

  // let newQuestion = req.body.question;
  // if (!newQuestion) {
  //   return res.status(400).json({ msg: "arguments 'question' is undefined" });
  // }

  // const query = { _id: QnAId };
  // const update = { $set: { question: newQuestion } };
  // //TODO : 유저 인증 추가(find query로 가져와서 확인)
  // QnAModel.updateOne(query, update)
  //   .exec()
  //   .then((result) => {
  //     console.log(result);
  //     if (result.n) {
  //       res.status(200).json({ msg: "Success" });
  //     } else {
  //       //QnAId에 매핑되는 Document가 없음
  //       res.status(404).json({ msg: "QnA Not Found" });
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).json({ msg: "Internal Server Error" });
  //   });

  const QnAId = tryConvertToObjectId(req.params.QnAId);
  if (!QnAId) {
    //QnAId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }

  let newQuestion = req.body.question;
  if (!newQuestion) {
    return res.status(400).json({ msg: "arguments 'question' is undefined" });
  }

  try {
    const query = { _id: QnAId };
    const update = { $set: { question: newQuestion } };
    const result = await QnAModel.updateOne(query, update).lean();
    if (result.n) {
      res.status(200).json({ msg: "Success" });
    } else {
      //QnAId에 매핑되는 Document가 없음
      res.status(404).json({ msg: "QnA Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

//질문을 삭제한다.
//
//URL 매개변수
//QnAId : 삭제할 질문(QnA)의 ObjectId
//
//Body 매개변수
//
export const deleteQuestion = async (req, res) => {
  //TODO : 유저 인증 추가

  // const QnAId = tryConvertToObjectId(req.params.QnAId);
  // if (!QnAId) {
  //   //QnAId가 유효하지 않은 형식(ObjectId로 변환 불가능)
  //   return res.status(400).json({ msg: "Bad Request" });
  // }
  // QnAModel.findOne({ _id: QnAId })
  //   .exec()
  //   .then((document) => {
  //     if (!document) {
  //       //QnAId에 매핑되는 Document가 없음
  //       res.status(404).json({ msg: "QnA Not Found" });
  //       throw 0; //to break promise chain
  //     }
  //     //TODO : 유저 인증 추가
  //     return QnAModel.deleteOne({ _id: QnAId });
  //   })
  //   .then(() => {
  //     const query = { QnA: QnAId };
  //     const update = { $pull: { QnA: QnAId } };
  //     return lectureModel.updateOne(query, update);
  //   })
  //   .then((result) => {
  //     if (!result.n) {
  //       //lectureId에 매핑되는 Document가 없음
  //       res.status(404).json({ msg: "Lecture Not Found" });
  //       return;
  //     }
  //     res.status(200).json({ msg: "Success" });
  //   })
  //   .catch((err) => {
  //     if (err === 0) {
  //       return;
  //     }
  //     console.log(err);
  //     res.status(500).json({ msg: "Internal Server Error" });
  //   });

  const QnAId = tryConvertToObjectId(req.params.QnAId);
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
    if (false) {
      //현재 로그인 정보와 document의 writerId가 일치하지 않음
      return res.status(400).json({ msg: "Bad Request" });
    }
    const deletePromise = QnADocument.remove();
    const updatePromise = lectureModel.updateOne(lectureQuery, lectureUpdate);
    const values = await Promise.All([deletePromise, updatePromise]);
    if (!values[1].n) {
      // lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    res.status(200).json({ msg: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
