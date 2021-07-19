import lectureModel from "../models/Lecture";
import { tryConvertToObjectId } from "./filter";

export const getEpliogue = async (req, res) => {
  const lectureId = tryConvertToObjectId(req.body.lectureId);
  if (!lectureId) {
    //lectureId가 유효하지 않은 형식(ObjectId로 변환 불가능)
    return res.status(400).json({ msg: "Bad Request" });
  }

  try {
    const query = { _id: lectureId };
    const result = await lectureModel.findOne(query).lean();
    return res.status(200).json(result.epliogue);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const postEpliogue = async (req, res) => {
  const lectureId = tryConvertToObjectId(req.body.lectureId);
  let data = req.body.data;
  if (!lectureId || !data) {
    return res.status(400).json({ msg: "Bad Request" });
  }

  try {
    //Query 내용 : lectureId에 매핑되는 Documents에서 Epliogue의 마지막 element만 가져옴
    const aggregateQuery = [
      { $project: { epliogue: { $slice: ["$epliogue", -1] } } },
      { $match: { _id: lectureId } },
    ];
    const aggResult = await lectureModel.aggregate(aggregateQuery);
    if (aggResult.length === 0) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    let id = 0;
    if (aggResult[0].epliogue.length > 0) {
      id = aggResult[0].epliogue[0].id + 1;
    }
    const epliogueDocument = {
      value: data,
      id: id,
      author: req.user,
      createAt: new Date(),
      recommendation: 0,
      recommendation_users: [],
    };
    const query = { _id: lectureId };
    const update = { $push: { epliogue: epliogueDocument } };
    const updateResult = await lectureModel.updateOne(query, update);
    if (!updateResult.n) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    res.status(200).json({ msg: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteEpliogue = async (req, res) => {
  const lectureId = tryConvertToObjectId(req.body.lectureId);
  const id = req.body.targetId * 1;
  let data = req.body.data;
  if (!lectureId || isNaN(id) || !data) {
    return res.status(400).json({ msg: "Bad Request" });
  }

  try {
    const query = { _id: lectureId };
    const update = {
      $pull: { epliogue: { id: id, author: req.user } },
    };
    const updateResult = await lectureModel.updateOne(query, update);
    if (!updateResult.n) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    if (!updateResult.nModified) {
      //epliogueId에 매핑되는 Epliogue가 없거나, 작성자 미일치
      return res.status(404).json({ msg: "failure" });
    }
    res.status(200).json({ msg: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const putEpliogue = async (req, res) => {
  const lectureId = tryConvertToObjectId(req.body.lectureId);
  const id = req.body.targetId * 1;
  let data = req.body.data;
  if (!lectureId || isNaN(id) || !data) {
    return res.status(400).json({ msg: "Bad Request" });
  }

  try {
    const query = {
      _id: lectureId,
      epliogue: { $elemMatch: { id: id, author: req.user } },
    };
    const update = { $set: { "epliogue.$.value": data } };
    const updateResult = await lectureModel.updateOne(query, update);
    if (!updateResult.n) {
      //lectureId에 매핑되는 Document가 없거나
      //또는 epliogueId가 epliogue 배열에 존재하지 않거나
      //또는 작성자 정보 미일치
      return res.status(404).json({ msg: "failure" });
    }
    res.status(200).json({ msg: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const recommendation = async (req, res) => {
  const userId = req.user;
  const lectureId = tryConvertToObjectId(req.body.lectureId);
  const targetId = req.body.targetId * 1;
  if (!lectureId || isNaN(targetId)) {
    return res.status(400).json({ msg: "Bad Request" });
  }

  try {
    const query = {
      _id: lectureId,
      epliogue: {
        $elemMatch: {
          id: targetId,
          recommendation_users: { $nin: [userId] },
        },
      },
    };
    const update = {
      $inc: {
        "epliogue.$.recommendation": 1,
      },
      $addToSet: {
        "epliogue.$.recommendation_users": userId,
      },
    };
    const result = await lectureModel.updateOne(query, update);
    if (!result.n) {
      return res.status(404).json({ msg: "Failure" });
    }
    res.status(200).json({ msg: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
