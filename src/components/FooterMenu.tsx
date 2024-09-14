import { useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";

const FooterMenu = () => {
  const navigate = useNavigate();

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
        <button
          type="button"
          aria-label="Logout Button"
          onClick={() => navigate("/")}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default FooterMenu;
