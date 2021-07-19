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

//  /:lectureId
export const getConnectedLecture = async (req, res) => {
  const lectureId = tryConvertToObjectId(req.body.lectureId);
  try {
    const query = { _id: lectureId };
    const select = { connected_lecture: 1, _id: 0 };
    let documents = await lectureModel.findOne(query, select).lean();
    const length = documents.connected_lecture.length;
    //
    //documents 상태 : {connected_lecture: [connected_lecture documents...] }
    for (let i = 0; i < length; ++i) {
      let titleQuery = { _id: documents.connected_lecture[i].lectureId };
      let result = await lectureModel.findOne(titleQuery);
      documents.connected_lecture[i].lectureTitle = result.title;
    }
    res.status(200).json(documents.connected_lecture);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const postConnectedLecutre = async (req, res) => {
  const args = await argumentsCheck(
    req.body.url,
    req.body.description,
    req.body.lectureId
  );
  if (!args.valid) {
    return res.status(400).json({ msg: "Bad Request" });
  }
  if (args.error) {
    console.log(args.errorlog);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
  try {
    const aggregateQuery = [
      {
        $project: { connected_lecture: { $slice: ["$connected_lecture", -1] } },
      },
      { $match: { _id: args.lectureId } },
    ];
    const aggResult = await lectureModel.aggregate(aggregateQuery);
    if (aggResult.length === 0) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    let id = 0;
    if (aggResult[0].connected_lecture.length > 0) {
      id = aggResult[0].connected_lecture[0].id + 1;
    }
    const document = {
      id: id,
      lectureId: args.connectedLectureId,
      description: args.description,
      author: req.user,
      createAt: new Date(),
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

export const putConnectedLecture = async (req, res) => {
  const args = await argumentsCheck(
    req.body.url,
    req.body.description,
    req.body.lectureId
  );
  const targetId = req.body.targetId * 1;
  if (!args.valid || isNaN(targetId)) {
    return res.status(400).json({ msg: "Bad Request" });
  }
  if (args.error) {
    console.log(args.errorlog);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
  try {
    const query = {
      _id: args.lectureId,
      connected_lecture: { $elemMatch: { id: targetId, author: req.user } },
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

export const deleteConnectedLecture = async (req, res) => {
  const lectureId = tryConvertToObjectId(req.body.lectureId);
  const targetId = req.body.targetId * 1;
  if (!lectureId || isNaN(targetId)) {
    return res.status(400).json({ msg: "Bad Request" });
  }

  try {
    const query = { _id: lectureId };
    const update = {
      $pull: {
        connected_lecture: {
          id: targetId,
          author: req.user,
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

export const recommendation = async (req, res) => {
  const userId = req.user;
  const lectureId = tryConvertToObjectId(req.body.lectureId);
  const targetId = req.body.targetId * 1;

  let query = null;
  let update = null;
  if (req.body.mode === "before") {
    query = {
      _id: lectureId,
      connected_lecture: {
        $elemMatch: {
          id: targetId,
          recommendation_before_users: { $nin: [userId] },
        },
      },
    };
    update = {
      $inc: {
        "connected_lecture.$.recommendation_before": 1,
      },
      $addToSet: {
        "connected_lecture.$.recommendation_before_users": userId,
      },
    };
  } else if (req.body.mode === "after") {
    query = {
      _id: lectureId,
      connected_lecture: {
        $elemMatch: {
          id: targetId,
          recommendation_after_users: { $nin: [userId] },
        },
      },
    };
    update = {
      $inc: {
        "connected_lecture.$.recommendation_after": 1,
      },
      $addToSet: {
        "connected_lecture.$.recommendation_after_users": userId,
      },
    };
  }

  if (!lectureId || isNaN(targetId) || !query || !update) {
    return res.status(400).json({ msg: "Bad Request" });
  }

  try {
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
