import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>메인 페이지</h1>} />
      <Route path="/posts" element={<h1>게시글 리스트 페이지</h1>} />
      <Route path="/posts/:id" element={<h1>게시글 상세 페이지</h1>} />
      <Route path="/posts/edit/:id" element={<h1>게시글 수정 페이지</h1>} />
      <Route path="/profile" element={<h1>프로필 페이지</h1>} />
      <Route path="/profile/edit" element={<h1>프로필 수정 페이지</h1>} />
      <Route path="/search" element={<h1>해시태그 검색 페이지</h1>} />
      <Route path="/notification" element={<h1>알림 페이지</h1>} />
      <Route path="/users/login" element={<h1>로그인 페이지</h1>} />
      <Route path="/users/signup" element={<h1>회원가입 페이지</h1>} />
    </Routes>
  );
}

export default App;
