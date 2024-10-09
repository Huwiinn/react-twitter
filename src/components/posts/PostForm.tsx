import { FiImage } from "react-icons/fi";
import { useContext, useState } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db, storage } from "firebaseApp";
import AuthContext from "context/AuthContext";
import { uploadString, ref, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export const PostForm = () => {
  const [isContent, setIsContent] = useState<string>("");
  const [hashtag, setHashtag] = useState<string>("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useContext(AuthContext);

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);

    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      console.log({ result });

      setImageFile(result);
    };
  };

  console.log({ imageFile });

  const onSubmit = async (e: any) => {
    setIsSubmitting(true);
    e.preventDefault();

    const key = `${user?.uid}/${uuidv4()}_img`;
    const storageRef = ref(storage, key);

    try {
      // 1. 이미지 먼저 업로드
      let imageUrl = "";
      if (imageFile) {
        const data = await uploadString(storageRef, imageFile, "data_url");
        console.log({ data });
        imageUrl = await getDownloadURL(data?.ref);
      }

      // 2. 업로드된 이미지의 다운로드 url 업데이트
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
        imageUrl: imageUrl,
      });

      setTags([]);
      setHashtag("");
      setIsContent("");
      setImageFile(null);

      toast.success("게시글을 작성하였습니다.");

      setIsSubmitting(false);
    } catch (error) {
      console.error(`게시글 작성 실패 : ${error}`);
      toast.error("게시글 작성에 실패했습니다.");
      setIsSubmitting(false);
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

  const handleDeleteImage = () => {
    setImageFile(null);
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
        <div className="post_form--image-area">
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

          {imageFile && (
            <div className="post_form__attachment">
              <img src={imageFile} alt="첨부 이미지" width={100} height={100} />
              <button
                className="post_form__clear-btn"
                type="button"
                onClick={handleDeleteImage}>
                Clear
              </button>
            </div>
          )}
        </div>
        <input
          type="submit"
          value="Tweet"
          className="post_form--submit-btn"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};
