import { FiImage } from "react-icons/fi";
import { useContext, useState } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "firebaseApp";
import AuthContext from "context/AuthContext";

export const PostForm = () => {
  const [isContent, setIsContent] = useState<string>("");
  const [hashtag, setHashtag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const { user } = useContext(AuthContext);

  const handleFileUpload = () => {
    console.log("파일 업로드~");
  };

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
        hashtags: tags,
      });

      setTags([]);
      setHashtag("");
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

  const onChangeHashTag = (e: any) => {
    setHashtag(e.target.value.trim());
  };

  const handleKeyUp = (e: any) => {
    e.preventDefault();

    if (e.keyCode === 32 && e.target.value.trim() !== "") {
      // 태그를 생성한다
      // 만약 같은 태그가 있다면 에러를 띄운다.
      alert("스페이스바 눌렀네용?");
      if (tags?.includes(e.target.value?.trim())) {
        toast.error("깉은 태그가 있습니다.");
      } else {
        setTags((prev) => (prev?.length > 0 ? [...prev, hashtag] : [hashtag]));
        setHashtag("");
      }
    }
  };

  const handleRemoveHashTag = (tag: string) => {
    setTags(tags.filter((v) => v !== tag));
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
      {/* hash tag */}
      <div className="post_form__hashtags">
        <div className="post_form__hashtags-outputs">
          {tags?.map((tag, idx) => (
            <span
              className="post_form__hashtags-tag"
              key={`${idx}-${tag}`}
              onClick={() => handleRemoveHashTag(tag)}>
              #{tag}
            </span>
          ))}
        </div>
        <input
          className="post_form__input"
          name="hashtag"
          id="hashtag"
          placeholder="해시태그를 입력하고 스페이스바를 눌러주세요."
          type="text"
          maxLength={12}
          onChange={onChangeHashTag}
          onKeyUp={handleKeyUp}
          value={hashtag}
        />
      </div>
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
