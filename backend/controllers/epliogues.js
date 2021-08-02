import lectureModel from "../models/Lecture";
import { ARGUMENTS, getArgs } from "./filter";

// {
//   data: String,
//   id: Number,
//   author: objectId,
//   createdAt: Date,
//   recommendation: Number,
//   is_recommended : Boolean,  //추천 여부
// }

export const getEpliogue = async (req, res) => {
  const args = await getArgs(req, res, [
    ARGUMENTS.LECTUREID,
    ARGUMENTS.PAGE,
    ARGUMENTS.SORTBY_EPLIOGUE,
  ]);
  if (!args) {
    return;
  }
  if (req.user) {
    var userId = String(req.user._id);
  }

  try {
    const limit = args[ARGUMENTS.PAGE.name] ? 10 : Infinity; //page당 document갯수 10
    const skipDocuments = args[ARGUMENTS.PAGE.name]
      ? (args[ARGUMENTS.PAGE.name] - 1) * limit
      : 0;
    let sort = null;
    if (args[ARGUMENTS.SORTBY_EPLIOGUE.name] === "older") {
      sort = { "epliogue.createAt": 1 };
    } else if (args[ARGUMENTS.SORTBY_EPLIOGUE.name] === "recent") {
      sort = { "epliogue.createAt": -1 };
    } else if (args[ARGUMENTS.SORTBY_EPLIOGUE.name] === "recommendation") {
      sort = { "epliogue.recommendation": -1, "epliogue.createAt": 1 };
    }
    const query = [
      { $match: { _id: args[ARGUMENTS.LECTUREID.name] } },
      { $project: { epliogue: 1, _id: 0 } },
      { $unwind: "$epliogue" },
      { $sort: sort },
      { $skip: skipDocuments },
      { $limit: limit },
    ];
    const result = await lectureModel.aggregate(query);
    //2중 오브젝트 상태를 단일 오브젝트 배열로 변환, property에 추천 여부 추가시킴
    const length = result.length;
    let epliogues = Array(length);
    for (let i = 0; i < length; ++i) {
      result[i].epliogue.is_recommended = false;
      if (userId) {
        for (let recommendedUserId of result[i].epliogue.recommendation_users) {
          if (userId === String(recommendedUserId)) {
            result[i].epliogue.is_recommended = true;
            break;
          }
        }
      }
      delete result[i].epliogue.recommendation_users;
      epliogues[i] = result[i].epliogue;
    }
    return res.status(200).json(epliogues);
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
      { $match: { _id: args[ARGUMENTS.LECTUREID.name] } },
      { $project: { epliogue: { $slice: ["$epliogue", -1] } } },
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
