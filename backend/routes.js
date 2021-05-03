//global
const HOME = "/";
const SIGNIN = "/signin";
const MYPAGE = "/:id/mypage";
const WRITING = "/writing";
const LECTURE = "/lecture/:lectureId";
const SEARCH = "/search/:lectureId";

const routes = {
  home: HOME,
  singin: SIGNIN,
  mypage: MYPAGE,
  writing: WRITING,
  lecture: LECTURE,
  search: SEARCH,
};

export default routes;

// 로그인 signin
// 회원가입 signup
// 마이페이지 :id/mypage
// 글쓰기 writing
// 강좌 lecture/:lectureId
