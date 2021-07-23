import QnAModel from "../models/QnA";
import { ARGUMENTS, getArgs } from "./filter";

export const postAnswer = async (req, res) => {
  const userId = req.user._id;
  const args = await getArgs(req, res, [ARGUMENTS.QNAID, ARGUMENTS.DATA]);
  if (!args) {
    return;
  }
  try {
    const aggregateQuery = [
      { $project: { answer: { $slice: ["$answer", -1] } } },
      { $match: { _id: args[ARGUMENTS.QNAID.name] } },
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
      author: userId,
      createAt: new Date(),
      data: args[ARGUMENTS.DATA.name],
      id: id,
    };
    const query = { _id: args[ARGUMENTS.QNAID.name] };
    const update = { $push: { answer: document } };
    const updateResult = await QnAModel.updateOne(query, update);
    if (!updateResult.n) {
      return res.status(404).json({ msg: "QnA Not Found" });
    }
    res.status(201).json({ msg: "Success", contentsId: id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const putAnswer = async (req, res) => {
  const userId = req.user._id;
  const args = await getArgs(req, res, [
    ARGUMENTS.QNAID,
    ARGUMENTS.DATA,
    ARGUMENTS.TARGETID,
  ]);
  if (!args) {
    return;
  }
  try {
    const query = {
      _id: args[ARGUMENTS.QNAID.name],
      answer: {
        $elemMatch: { id: args[ARGUMENTS.TARGETID.name], author: userId },
      },
    };
    const update = { $set: { "answer.$.data": args[ARGUMENTS.DATA.name] } };
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
  const userId = req.user._id;
  const args = await getArgs(req, res, [ARGUMENTS.QNAID, ARGUMENTS.TARGETID]);
  if (!args) {
    return;
  }
  try {
    const query = { _id: args[ARGUMENTS.QNAID.name] };
    const update = {
      $pull: {
        answer: { id: args[ARGUMENTS.TARGETID.name], author: userId },
      },
    };
    const updateResult = await QnAModel.updateOne(query, update);
    if (!updateResult.n) {
      return res.status(404).json({ msg: "QnA Not Found" });
    }
    if (!updateResult.nModified) {
      return res.status(404).json({ msg: "Failure" });
    }
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
