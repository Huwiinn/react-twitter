import { useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
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
          <FaHome /> Home
        </button>
        <button
          type="button"
          aria-label="Profile Button"
          onClick={() => navigate("/profile")}>
          <FaUser /> Profile
        </button>
        {user === null ? (
          <button
            type="button"
            aria-label="Login Button"
            onClick={() => navigate("/users/login")}>
            <FaSignInAlt /> Login
          </button>
        ) : (
          <button
            type="button"
            aria-label="Logout Button"
            onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default FooterMenu;
