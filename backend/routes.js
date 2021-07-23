//global
const HOME = "/";
const SIGNIN = "/signin";
const SIGNUP = "/signup";
const LOGOUT = "/logout";
const MYPAGE = "/:id/mypage";
const WRITING = "/writing";
const SEARCH = "/search/:content";
const CHANGE_PASSWORD = "/change-password";

//lecture
const LECTURE = "/lecture";
const PLUS_RECOMMEND_LECTURE = "/recommend-plus";
const MINUS_RECOMMEND_LECTURE = "/recommend-minus";
const UPLOAD_LECTURE = "/upload-lecture";
const ADD_CURRICULUM = "/add-curriculum";
const MODIFY = "/modify";

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
  search: (content) => {
    if (content) return `/search/${content}`;
    else return SEARCH;
  },
  plusRecommendLecture: PLUS_RECOMMEND_LECTURE,
  minusRecommendLecture: MINUS_RECOMMEND_LECTURE,
  modify: MODIFY,
};

export default routes;
