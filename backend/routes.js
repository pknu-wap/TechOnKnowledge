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
};

export default routes;
