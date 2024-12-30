import AuthContext from "context/AuthContext";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

export interface CommentFormProps {
  post: PostProps | null;
}

export default function CommentForm({ post }: CommentFormProps) {
  const [comment, setComment] = useState<string>("");

  const { user } = useContext(AuthContext);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (post && user) {
      try {
        const postRef = doc(db, "posts", post?.id);
        const commnetObj = {
          comment: comment,
          uid: user?.uid,
          email: user?.email,
          createdAt: new Date().toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        };

        await updateDoc(postRef, {
          comment: arrayUnion(commnetObj),
        });

        toast.success("댓글이 생성되었습니다.");
        setComment("");
      } catch (error: any) {
        console.error(error);
      }
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "comment") {
      setComment(value);
    }
  };

  return (
    <form className="post_form" onSubmit={onSubmit}>
      <textarea
        className="post_form--textarea"
        name="comment"
        id="comment"
        required
        placeholder="댓글을 작성해주세요."
        onChange={onChange}
        value={comment}
      />
      <div className="post_form--submit-area">
        <div />
        <input
          type="submit"
          value="Comment"
          className="post_form--submit-btn"
          disabled={!comment}
        />
      </div>
    </form>
  );
}
