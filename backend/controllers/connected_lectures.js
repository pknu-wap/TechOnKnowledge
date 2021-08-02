import lectureModel from "../models/Lecture";
import { ARGUMENTS, getArgs } from "./filter";

// {
//   id: Number,
//   lectureId: objectId, //관련강의의 id
//   description: String,
//   author: objectId,
//   createAt: Date,
//   recommendation_before: Number
//   is_recommended_before: Boolean,
//   recommendation_after: Number,
//   is_recommended_after: Boolean,
// }

export const getConnectedLecture = async (req, res) => {
  const args = await getArgs(req, res, [
    ARGUMENTS.LECTUREID,
    ARGUMENTS.SORTBY,
    ARGUMENTS.PAGE,
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
    if (args[ARGUMENTS.SORTBY.name] === "older") {
      sort = { "connected_lecture.createAt": 1 };
    } else if (args[ARGUMENTS.SORTBY.name] === "recent") {
      sort = { "connected_lecture.createAt": -1 };
    }
    const query = [
      { $match: { _id: args[ARGUMENTS.LECTUREID.name] } },
      { $project: { connected_lecture: 1, _id: 0 } },
      { $unwind: "$connected_lecture" },
      { $sort: sort },
      { $skip: skipDocuments },
      { $limit: limit },
    ];
    const result = await lectureModel.aggregate(query);
    //2중 오브젝트 상태를 단일 오브젝트 배열로 변환, property에 추천 여부 추가시킴
    const length = result.length;
    let connectedLectures = Array(length);
    for (let i = 0; i < length; ++i) {
      let titleQuery = { _id: result[i].connected_lecture.lectureId };
      let connectedLecture = await lectureModel.findOne(titleQuery);
      result[i].connected_lecture.lectureTitle = connectedLecture.title;
      result[i].connected_lecture.is_recommended_before = false;
      result[i].connected_lecture.is_recommended_after = false;

      if (userId) {
        for (let recommendedUserId of result[i].connected_lecture
          .recommendation_before_users) {
          if (userId === String(recommendedUserId)) {
            result[i].connected_lecture.is_recommended_before = true;
            break;
          }
        }
        for (let recommendedUserId of result[i].connected_lecture
          .recommendation_after_users) {
          if (userId === String(recommendedUserId)) {
            result[i].connected_lecture.is_recommended_after = true;
            break;
          }
        }
      }

      delete result[i].connected_lecture.recommendation_before_users;
      delete result[i].connected_lecture.recommendation_after_users;
      connectedLectures[i] = result[i].connected_lecture;
    }
    res.status(200).json(connectedLectures);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const postConnectedLecutre = async (req, res) => {
  const userId = req.user._id;
  const args = await getArgs(req, res, [
    ARGUMENTS.LECTUREID,
    ARGUMENTS.CONNECTEDLECTUREID,
    ARGUMENTS.DESCRIPTION,
  ]);
  if (!args) {
    return;
  }
  try {
    const aggregateQuery = [
      { $match: { _id: args[ARGUMENTS.LECTUREID.name] } },
      {
        $project: { connected_lecture: { $slice: ["$connected_lecture", -1] } },
      },
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
      lectureId: args[ARGUMENTS.CONNECTEDLECTUREID.name],
      description: args[ARGUMENTS.DESCRIPTION.name],
      author: userId,
      createAt: new Date(),
      recommendation_before: 0,
      recommendation_before_users: [],
      recommendation_after: 0,
      recommendation_after_users: [],
    };
    const query = { _id: args[ARGUMENTS.LECTUREID.name] };
    const update = { $push: { connected_lecture: document } };
    const result = await lectureModel.updateOne(query, update);
    if (!result.n) {
      //lectureId에 매핑되는 Document가 없음
      return res.status(404).json({ msg: "Lecture Not Found" });
    }
    res.status(201).json({ msg: "Success", contentsId: id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const putConnectedLecture = async (req, res) => {
  const userId = req.user._id;
  const args = await getArgs(req, res, [
    ARGUMENTS.LECTUREID,
    ARGUMENTS.CONNECTEDLECTUREID,
    ARGUMENTS.DESCRIPTION,
    ARGUMENTS.TARGETID,
  ]);
  if (!args) {
    return;
  }
  try {
    const query = {
      _id: args[ARGUMENTS.LECTUREID.name],
      connected_lecture: {
        $elemMatch: { id: args[ARGUMENTS.TARGETID.name], author: userId },
      },
    };
    const update = {
      $set: {
        "connected_lecture.$.lectureId": args[ARGUMENTS.CONNECTEDLECTUREID.name],
        "connected_lecture.$.description": args[ARGUMENTS.DESCRIPTION.name],
      },
    };
    const result = await lectureModel.updateOne(query, update);
    if (!result.n) {
      return res.status(400).json({ msg: "failure" });
    }
    res.status(200).json({ msg: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteConnectedLecture = async (req, res) => {
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
        connected_lecture: {
          id: args[ARGUMENTS.TARGETID.name],
          author: userId,
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
    res.status(204).send();
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
    before_recommend: {
      query: {
        _id: args[ARGUMENTS.LECTUREID.name],
        connected_lecture: {
          $elemMatch: {
            id: args[ARGUMENTS.TARGETID.name],
            recommendation_before_users: { $nin: [userId] },
          },
        },
      },
      update: {
        $inc: {
          "connected_lecture.$.recommendation_before": 1,
        },
        $addToSet: {
          "connected_lecture.$.recommendation_before_users": userId,
        },
      },
    },
    before_cancel: {
      query: {
        _id: args[ARGUMENTS.LECTUREID.name],
        connected_lecture: {
          $elemMatch: {
            id: args[ARGUMENTS.TARGETID.name],
            recommendation_before_users: { $in: [userId] },
          },
        },
      },
      update: {
        $inc: {
          "connected_lecture.$.recommendation_before": -1,
        },
        $pull: {
          "connected_lecture.$.recommendation_before_users": userId,
        },
      },
    },
    after_recommend: {
      query: {
        _id: args[ARGUMENTS.LECTUREID.name],
        connected_lecture: {
          $elemMatch: {
            id: args[ARGUMENTS.TARGETID.name],
            recommendation_after_users: { $nin: [userId] },
          },
        },
      },
      update: {
        $inc: {
          "connected_lecture.$.recommendation_after": 1,
        },
        $addToSet: {
          "connected_lecture.$.recommendation_after_users": userId,
        },
      },
    },
    after_cancel: {
      query: {
        _id: args[ARGUMENTS.LECTUREID.name],
        connected_lecture: {
          $elemMatch: {
            id: args[ARGUMENTS.TARGETID.name],
            recommendation_after_users: { $in: [userId] },
          },
        },
      },
      update: {
        $inc: {
          "connected_lecture.$.recommendation_after": -1,
        },
        $pull: {
          "connected_lecture.$.recommendation_after_users": userId,
        },
      },
    },
  };
  try {
    var query = recommendQuery[req.body.mode].query;
    var update = recommendQuery[req.body.mode].update;
  } catch (err) {
    return res.status(400).json({
      msg:
        "Unvalid 'body.mode' values : Only allowed 'before_recommend', 'before_cancel', 'after_recommend', 'after_cancel'",
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
