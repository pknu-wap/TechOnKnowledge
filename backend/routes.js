//global
const HOME = "/";
const SIGNIN = "/signin";
const SIGNUP = "/signup";
const LOGOUT = "/logout";
const MYPAGE = "/:id/mypage";
const WRITING = "/writing";
const LECTURE = "/lecture/:lectureId";
const SEARCH = "/search/:lectureId";
const CHANGE_PASSWORD = "/change-password";
const UPLOAD_LECTURE = "/upload-lecture";
const ADD_CURRICULUM = "/add-curriculum";
const EPLIOGUE = "/epliogue";
const QNA = "/qna";
const QNA_ANSWER = "/qna-answer";
const CONNECTED_LECTURE = "/connected-lecture";

const GET_EPLIOGUE = "/:lectureId";
const POST_EPLIOGUE = "/:lectureId";
const DELETE_EPLIGOUE = "/:lectureId/:epliogueId";
const PUT_EPLIGOUE = "/:lectureId/:epliogueId";
const GET_QNA = "/:lectureId";
const POST_QUESTION = "/:lectureId";
const PUT_QUESTION = "/:QnAId";
const DELETE_QUESTION = "/:QnAId";
const POST_ANSWER = "/:QnAId";
const PUT_ANSWER = "/:QnAId/:targetId";
const DELETE_ANSWER = "/:QnAId/:targetId";
const GET_CONNECTED_LECTURE = "/:lectureId";
const POST_CONNECTED_LECTURE = "/:lectureId";
const PUT_CONNECTED_LECTURE = "/:lectureId/:targetId";
const DELETE_CONNECTED_LECTURE = "/:lectureId/:targetId";
const RECOMMENDATION_BEFORE_CONNECTED_LECTURE = "/recommendation-before/:lectureId";
const RECOMMENDATION_AFTER_CONNECTED_LECTURE = "/recommendation-after/:lectureId";

//Kakao

const KAKAO = "/auth/Kakao";
const KAKAO_CALLBACK = "/auth/github/callback";

const routes = {
  home: HOME,
  signin: SIGNIN,
  signup: SIGNUP,
  mypage: MYPAGE,
  writing: WRITING,
  lecture: LECTURE,
  search: SEARCH,
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
  //
  getEpliogue: GET_EPLIOGUE,
  postEpliogue: POST_EPLIOGUE,
  deleteEpliogue: DELETE_EPLIGOUE,
  putEpliogue: PUT_EPLIGOUE,
  getQnA: GET_QNA,
  postQuestion: POST_QUESTION,
  putQuestion: PUT_QUESTION,
  deleteQuestion: DELETE_QUESTION,
  postAnswer: POST_ANSWER,
  putAnswer: PUT_ANSWER,
  deleteAnswer: DELETE_ANSWER,
  getConnectedLecture: GET_CONNECTED_LECTURE,
  postConnectedLecture: POST_CONNECTED_LECTURE,
  putConnectedLecture: PUT_CONNECTED_LECTURE,
  deleteConnectedLecture: DELETE_CONNECTED_LECTURE,
  recommendationAfterConnectedLecture: RECOMMENDATION_AFTER_CONNECTED_LECTURE,
  recommendationBeforeConnectedLecture: RECOMMENDATION_BEFORE_CONNECTED_LECTURE,
};

export default routes;
