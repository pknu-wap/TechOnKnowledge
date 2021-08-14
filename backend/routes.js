//global
const HOME = "/";
const SIGNIN = "/signin";
const SIGNUP = "/signup";
const LOGOUT = "/logout";
const MYPAGE = "/:id/mypage";
const WRITING = "/writing";
const CHANGE_PASSWORD = "/change-password";

//lecture
const LECTURE = "/lecture";
const SEARCH = "/search/:content";
const PLUS_RECOMMEND_LECTURE = "/recommend-plus";
const MINUS_RECOMMEND_LECTURE = "/recommend-minus";
const UPLOAD_LECTURE = "/upload-lecture";
const ADD_CURRICULUM = "/add-curriculum";
const EPLIOGUE = "/epliogue";
const EPLIOGUE_RECOMMEND = "/recommend";
const QNA = "/qna";
const QNA_ANSWER = "/qna-answer";
const CONNECTED_LECTURE = "/connected-lecture";
const CONNECTED_LECTURE_RECOMMEND = "/recommend";
const MODIFY = "/modify";
const DETAIL = "/:lectureId/detail";

//Kakao

const KAKAO = "/auth/kakao";
const KAKAO_CALLBACK = "/auth/kakao/callback";

const routes = {
  home: HOME,
  signin: SIGNIN,
  signup: SIGNUP,
  mypage: MYPAGE,
  writing: WRITING,
  lecture: LECTURE,
  kakao: KAKAO,
  kakaoCallback: KAKAO_CALLBACK,
  logout: LOGOUT,
  changePassword: CHANGE_PASSWORD,
  addCurriculum: ADD_CURRICULUM,
  uploadLecture: UPLOAD_LECTURE,
  epliouge: EPLIOGUE,
  QnA: QNA,
  QnAAnswer: QNA_ANSWER,
  connectedLecture: CONNECTED_LECTURE,
  search: (content) => {
    if (content) return `/search/${content}`;
    else return SEARCH;
  },
  plusRecommendLecture: PLUS_RECOMMEND_LECTURE,
  minusRecommendLecture: MINUS_RECOMMEND_LECTURE,
  recommendEpliogue: EPLIOGUE_RECOMMEND,
  recommendConnectedLecture: CONNECTED_LECTURE_RECOMMEND,
  modify: MODIFY,
  detail: (lectureId) => {
    if(lectureId) return `/${lectureId}/detail`;
    else return DETAIL;
  }
};

export default routes;
