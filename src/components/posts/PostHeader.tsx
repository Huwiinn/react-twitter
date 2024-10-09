import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const PostHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="post__header">
      <button
        aria-label="back_btn"
        type="button"
        onClick={() => {
          navigate(-1);
        }}>
        <IoArrowBackOutline className="back_icon" />
      </button>
    </div>
  );
};

export default PostHeader;
