import HomePage from "pages/home";
import { Routes, Route, Navigate } from "react-router-dom";
import PostsPage from "pages/posts";
import PostEditPage from "pages/posts/edit/[id]";
import PostDetailPage from "pages/posts/[id]";
import ProfilePage from "pages/profile/index";
import SearchPage from "pages/search";
import LoginPage from "pages/users/login";
import SignupPage from "pages/users/signup";
import NotificationPage from "pages/notification";
import ProfileEditPage from "pages/profile/edit";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
      <Route path="/posts/edit/:id" element={<PostEditPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<ProfileEditPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/notification" element={<NotificationPage />} />
      <Route path="/users/login" element={<LoginPage />} />
      <Route path="/users/signup" element={<SignupPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};

export default Router;
