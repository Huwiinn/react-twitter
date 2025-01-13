import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaSearch,
} from "react-icons/fa";
import { HiMiniBellAlert } from "react-icons/hi2";
import AuthContext from "context/AuthContext";
import { useContext } from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import useTransition from "hooks/useTranslation";

const FooterMenu = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const t = useTransition();

  // console.log("user : ", user);

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
          onClick={() => navigate("/")}
        >
          <FaHome />
          <span>{t("MENU_HOME")}</span>
        </button>
        <button
          type="button"
          aria-label="Profile Button"
          onClick={() => navigate("/profile")}
        >
          <FaUser />
          <span>{t("MENU_PROFILE")}</span>
        </button>
        <button
          type="button"
          aria-label="Search Button"
          onClick={() => navigate("/search")}
        >
          <FaSearch />
          <span>{t("MENU_SEARCH")}</span>
        </button>
        <button
          type="button"
          aria-label="Search Button"
          onClick={() => navigate("/notifications")}
        >
          <HiMiniBellAlert />
          <span>{t("MENU_NOTIFICATIONS")}</span>
        </button>
        {user === null ? (
          <button
            type="button"
            aria-label="Login Button"
            onClick={() => navigate("/users/login")}
          >
            <FaSignInAlt />
            <span>Login</span>
          </button>
        ) : (
          <button
            type="button"
            aria-label="Logout Button"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>{t("MENU_LOGOUT")}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FooterMenu;
