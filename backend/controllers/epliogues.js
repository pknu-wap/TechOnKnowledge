import lectureModel from "../models/Lecture";
import { ARGUMENTS, getArgs } from "./filter";

export const getEpliogue = async (req, res) => {
  const args = await getArgs(req, res, [ARGUMENTS.LECTUREID]);
  if (!args) {
    return;
  }

  try {
    const query = { _id: args[ARGUMENTS.LECTUREID.name] };
    const result = await lectureModel.findOne(query).lean();
    if (!result) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    return res.status(200).json({ contents: result.epliogue, msg: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const postEpliogue = async (req, res) => {
  const userId = req.user._id;
  const args = await getArgs(req, res, [ARGUMENTS.LECTUREID, ARGUMENTS.DATA]);
  if (!args) {
    return;
  }

  try {
    //Query 내용 : lectureId에 매핑되는 Documents에서 Epliogue의 마지막 element만 가져옴
    const aggregateQuery = [
      { $project: { epliogue: { $slice: ["$epliogue", -1] } } },
      { $match: { _id: args[ARGUMENTS.LECTUREID.name] } },
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
      data: args[ARGUMENTS.DATA.name],
      id: id,
      author: userId,
      createAt: new Date(),
      recommendation: 0,
      recommendation_users: [],
    };
    const query = { _id: args[ARGUMENTS.LECTUREID.name] };
    const update = { $push: { epliogue: epliogueDocument } };
    const updateResult = await lectureModel.updateOne(query, update);
    if (!updateResult.n) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    res.status(201).json({ msg: "Success", contentsId: id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteEpliogue = async (req, res) => {
  const userId = req.user._id;
  const args = await getArgs(req, res, [
    ARGUMENTS.LECTUREID,
    ARGUMENTS.TARGETID,
  ]);
  if (!args) {
    return;
  }

  try {
    const query = { _id: args[ARGUMENTS.LECTUREID.name] };
    const update = {
      $pull: {
        epliogue: { id: args[ARGUMENTS.TARGETID.name], author: userId },
      },
    };
    const updateResult = await lectureModel.updateOne(query, update);
    if (!updateResult.n) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    if (!updateResult.nModified) {
      //epliogueId에 매핑되는 Epliogue가 없거나, 작성자 미일치
      return res.status(400).json({ msg: "failure" });
    }
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const putEpliogue = async (req, res) => {
  const userId = req.user._id;
  const args = await getArgs(req, res, [
    ARGUMENTS.LECTUREID,
    ARGUMENTS.DATA,
    ARGUMENTS.TARGETID,
  ]);
  if (!args) {
    return;
  }

  try {
    const query = {
      _id: args[ARGUMENTS.LECTUREID.name],
      epliogue: {
        $elemMatch: { id: args[ARGUMENTS.TARGETID.name], author: userId },
      },
    };
    const update = { $set: { "epliogue.$.data": args[ARGUMENTS.DATA.name] } };
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
  const userId = req.user._id;
  const args = await getArgs(req, res, [
    ARGUMENTS.LECTUREID,
    ARGUMENTS.TARGETID,
  ]);
  if (!args) {
    return;
  }

  const recommendQuery = {
    recommend: {
      query: {
        _id: args[ARGUMENTS.LECTUREID.name],
        epliogue: {
          $elemMatch: {
            id: args[ARGUMENTS.TARGETID.name],
            recommendation_users: { $nin: [userId] },
          },
        },
      },
      update: {
        $inc: {
          "epliogue.$.recommendation": 1,
        },
        $addToSet: {
          "epliogue.$.recommendation_users": userId,
        },
      },
    },
    cancel: {
      query: {
        _id: args[ARGUMENTS.LECTUREID.name],
        epliogue: {
          $elemMatch: {
            id: args[ARGUMENTS.TARGETID.name],
            recommendation_users: { $in: [userId] },
          },
        },
      },
      update: {
        $inc: {
          "epliogue.$.recommendation": -1,
        },
        $pull: {
          "epliogue.$.recommendation_users": userId,
        },
      },
    },
  };
  try {
    var query = recommendQuery[req.body.mode].query;
    var update = recommendQuery[req.body.mode].update;
  } catch (err) {
    return res.status(400).json({
      msg: "Unvalid 'body.mode' values : Only allowed 'recommend', 'cancel'",
    });
  }

  try {
    const result = await lectureModel.updateOne(query, update);
    if (!result.n) {
      return res.status(400).json({ msg: "Failure" });
    }
    res.status(200).json({ msg: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
