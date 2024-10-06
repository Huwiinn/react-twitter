import { FiImage } from "react-icons/fi";
import { useCallback, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "firebaseApp";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "pages/home";

export const PostEditForm = () => {
  const [isContent, setIsContent] = useState<string>("");
  const [post, setPost] = useState<PostProps | null>(null);
  const [hashtag, setHashtag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const params = useParams();
  const navigate = useNavigate();

  const getPost = useCallback(async () => {
    if (params.id) {
      const postRef = doc(db, "posts", params.id);
      const postSnap = await getDoc(postRef);

      setPost({ ...(postSnap?.data() as PostProps), id: postRef.id });
      setIsContent(postSnap?.data()?.content);
      setTags(postSnap.data()?.hashtags);
    }
  }, [params.id]);

  const handleFileUpload = () => {
    console.log("파일 업로드~");
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (post) {
        const postRef = doc(db, "posts", post?.id);

        await updateDoc(postRef, {
          content: isContent,
          hashtags: tags,
        });
      }
      setIsContent("");
      navigate(`/posts/${post?.id}`);
      toast.success("게시글을 수정하였습니다.");
    } catch (error) {
      console.error(`게시글 수정 실패 : ${error}`);
      toast.error("게시글 수정에 실패했습니다.");
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

  useEffect(() => {
    params.id && getPost();
  }, [getPost]);

  console.log("post : ", post);

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
        <input type="submit" value="수정" className="post_form--submit-btn" />
      </div>
    </form>
  );
};
