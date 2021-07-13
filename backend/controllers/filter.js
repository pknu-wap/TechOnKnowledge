//파일이름 미정
import mongoose from "mongoose";

//매개변수 str이 ObjectId로 변환 가능하면 변환하여 반환하고, 불가능할시 null을 반환한다.
//str이 undefined일때 -> null을 반환한다.
export const tryConvertToObjectId = (str) => {
  if (!str) {
    return null;
  }
  try {
    let id = mongoose.Types.ObjectId(str);
    return id;
  } catch (err) {
    return null;
  }
};

export const parseObjectId = (url) => {
  try {
    let id = url.slice(url.lastIndexOf("/") + 1);
    let objectId = mongoose.Types.ObjectId(id);
    return objectId;
  } catch (err) {
    return null;
  }
};

//TODO
//models/User.js 변경
//new Date()가 UTC+0 기준으로 잡히는 것 해결
//관련강의
//  이전에 배우기 추천/ 나중에 배우기 추천의 변수/함수 이름 정하기
//  추천 중복여부 document에 저장
//후기
//  추천 추가
//  추천 중복여부 document에 저장
//질문
//  answer 2개 이상으로 변경
