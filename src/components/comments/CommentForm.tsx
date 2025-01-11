import AuthContext from "context/AuthContext";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
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

  const handleCutString = (str: string) => {
    let cutStr = "";

    if (str.length > 14) {
      cutStr = str.slice(0, 14);
      console.log("cutStr : ", cutStr);
      return `${cutStr}...`;
    } else {
      console.log("str : ", str);
      return str;
    }
  };

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

        // 댓글이 생성되었다면 알림 생성하기
        if (user?.uid !== post?.uid) {
          await addDoc(collection(db, "notifications"), {
            createdAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            uid: post?.uid,
            isRead: false,
            url: `posts/${post?.id}`,
            content: `${handleCutString(
              post.content
            )} 글에 댓글이 작성되었습니다.`,
          });
        }

        setComment("");
        toast.success("댓글이 생성되었습니다.");
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
