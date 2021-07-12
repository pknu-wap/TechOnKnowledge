//파일이름 미정
import mongoose from "mongoose";

//매개변수 str이 ObjectId로 변환 가능하면 변환하여 반환하고, 불가능할시 null을 반환한다.
//str이 undefined일때 -> null을 반환한다.
export function tryConvertToObjectId(str) {
  if (!str) {
    return null;
  }
  try {
    let id = mongoose.Types.ObjectId(str);
    return id;
  } catch (err) {
    return null;
  }
}

//todo : models/User.js 변경
