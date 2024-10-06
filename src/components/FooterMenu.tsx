import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaSearch,
} from "react-icons/fa";
import AuthContext from "context/AuthContext";
import { useContext } from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";

const FooterMenu = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  console.log("user : ", user);

  const handleLogout = async () => {
    const auth = getAuth(app);
    navigate("/");
    toast.success("로그아웃 되었습니다.");
    try {
      await signOut(auth);
    } catch (error) {
      toast.error("로그아웃 실패했습니다.");
    }
  };

  return (
    <div className="footer">
      <div className="footer__grid">
        <button
          type="button"
          aria-label="Home Button"
          onClick={() => navigate("/")}>
          <FaHome />
          <span>Home</span>
        </button>
        <button
          type="button"
          aria-label="Profile Button"
          onClick={() => navigate("/profile")}>
          <FaUser />
          <span>Profile</span>
        </button>
        <button
          type="button"
          aria-label="Search Button"
          onClick={() => navigate("/search")}>
          <FaSearch />
          <span>Search</span>
        </button>
        {user === null ? (
          <button
            type="button"
            aria-label="Login Button"
            onClick={() => navigate("/users/login")}>
            <FaSignInAlt />
            <span>Login</span>
          </button>
        ) : (
          <button
            type="button"
            aria-label="Logout Button"
            onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FooterMenu;
