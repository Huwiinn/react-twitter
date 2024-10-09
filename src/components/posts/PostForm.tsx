import { FiImage } from "react-icons/fi";
import { useContext, useState } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db, storage } from "firebaseApp";
import AuthContext from "context/AuthContext";
import {
  uploadString,
  ref,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export const PostForm = () => {
  const [isContent, setIsContent] = useState<string>("");
  const [hashtag, setHashtag] = useState<string>("");
  // const [imageFile, setImageFile] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useContext(AuthContext);

  // const handleFileUpload = (e: any) => {
  //   const {
  //     target: { files },
  //   } = e;

  //   const uploadFiles = Array.from(e.target.files);
  //   console.log("uploadFiles : ", uploadFiles);

  //   const fileReader = new FileReader();
  //   fileReader?.readAsDataURL(files);

  //   fileReader.onloadend = (e: any) => {
  //     setImageFiles(uploadFiles as string[]);
  //   };
  // };

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    // FileList를 배열로 변환
    const uploadFiles = Array.from(files);
    console.log("uploadFiles : ", uploadFiles);

    // 업로드된 파일들을 저장할 배열
    const fileReaders: string[] = [];

    // 파일을 하나씩 읽기
    uploadFiles.forEach((file, index) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file as Blob); // 각 파일을 개별적으로 처리

      fileReader.onloadend = (event) => {
        console.log("event : ", event);
        const { result } = event.target as FileReader;

        if (result) {
          fileReaders.push(result as string); // 결과를 배열에 저장

          // 모든 파일이 로드된 후에 상태를 업데이트
          if (fileReaders.length === uploadFiles.length) {
            setImageFiles(fileReaders);
          }
        }
      };
    });
  };

  console.log({ imageFiles });

  const onSubmit = async (e: any) => {
    setIsSubmitting(true);
    e.preventDefault();

    try {
      // 1. 이미지 업로드
      const uploadPromises = imageFiles.map(async (image) => {
        const key = `${user?.uid}/${uuidv4()}_img`;

        // 여러장을 업로드 할 때에는 반복루프 내부에서 각각의 참조를 다시 생성해주어야 중복되지 않고 각 이미지가 업로드된다.
        const storageRef = ref(storage, key);

        // 이미지 업로드
        const data = await uploadString(storageRef, image, "data_url");

        // 업로드된 이미지의 다운로드 URL 가져오기
        return getDownloadURL(data.ref);
      });

      // 모든 업로드 작업이 완료될 때까지 기다림
      const imageUrls = await Promise.all(uploadPromises);

      console.log("uploadPromises : ", uploadPromises);
      console.log("imageUrls : ", imageUrls);

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
        imageUrl: imageUrls,
      });

      setTags([]);
      setHashtag("");
      setIsContent("");
      setImageFiles([]);

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
      // alert("스페이스바 눌렀네용?");
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
    setImageFiles([]);
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
            multiple
          />

          {imageFiles.length >= 1 && (
            <div className="post_form__attachment">
              {imageFiles?.map((image) => (
                <img src={image} alt="첨부 이미지" width={100} height={100} />
              ))}
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
