import { FiImage } from "react-icons/fi";

export const PostForm = () => {
  const handleFileUpload = () => {
    console.log("파일 업로드~");
  };

  return (
    <form className="post_form">
      <textarea
        className="post_form--textarea"
        required
        name="content"
        id="content"
        placeholder="What's happening?"
      />
      <div className="post_form--submit-area">
        <label htmlFor="file-input" className="post_form--file">
          <FiImage className="post_form--file-icon" />
        </label>
        <input
          type="file"
          id="file-input"
          name="file-input"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          aria-label="이미지 업로드"
        />
        <input type="submit" value="Tweet" className="post_form--submit-btn" />
      </div>
    </form>
  );
};
