import { useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import AuthContext from "context/AuthContext";
import { useContext } from "react";

const FooterMenu = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  console.log("user : ", user);

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
            onClick={() => navigate("/")}>
            <FaSignOutAlt /> Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default FooterMenu;
