import { FiImage } from "react-icons/fi";
import { useContext, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "firebaseApp";
import AuthContext from "context/AuthContext";

export const PostForm = () => {
  const [isContent, setIsContent] = useState<string>("");
  const { user } = useContext(AuthContext);
  const handleFileUpload = () => {
    console.log("파일 업로드~");
  };

  console.log("user : ", user);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "posts"), {
        content: isContent,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
      });

      setIsContent("");

      toast.success("게시글을 작성하였습니다.");
    } catch (error) {
      console.error(`게시글 작성 실패 : ${error}`);
      toast.error("게시글 작성에 실패했습니다.");
    }
  };

  const onChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "content") {
      setIsContent(value);
    }
  };

  return (
    <form className="post_form" onSubmit={onSubmit}>
      <textarea
        className="post_form--textarea"
        required
        name="content"
        id="content"
        placeholder="What's happening?"
        onChange={onChange}
        value={isContent}
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
