import { FiImage } from "react-icons/fi";
import { useCallback, useContext, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db, storage } from "firebaseApp";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "pages/home";
import AuthContext from "context/AuthContext";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import PostHeader from "components/posts/PostHeader";

export const PostEditForm = () => {
  const [isContent, setIsContent] = useState<string>("");
  const [post, setPost] = useState<PostProps | null>(null);
  const [hashtag, setHashtag] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const getPost = useCallback(async () => {
    if (params.id) {
      const postRef = doc(db, "posts", params.id);
      const postSnap = await getDoc(postRef);

      setPost({ ...(postSnap?.data() as PostProps), id: postRef.id });
      setIsContent(postSnap?.data()?.content);
      setTags(postSnap.data()?.hashtags);
      setImageFiles(postSnap.data()?.imageUrl);
    }
  }, [params.id]);

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

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (post) {
        // 새로운 사진이 업로드되면, 기존 사진을 지우고 새로운 사진 업로드
        if (post?.imageUrl && post?.imageUrl.length >= 1) {
          const deleteImgPromises = post?.imageUrl?.map(async (image) => {
            const imgRef = ref(storage, image);

            return await deleteObject(imgRef).catch((error) => {
              console.error(error);
            });
          });

          // 모든 이미지 삭제가 완료될 때까지 기다림
          await Promise.all(deleteImgPromises);

          await alert("이미지 제거 ~");
        }

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
        // 만약 사진이 아에 없다면 삭제
        const postRef = doc(db, "posts", post?.id);

        await updateDoc(postRef, {
          content: isContent,
          hashtags: tags,
          imageUrl: imageUrls,
        });
      }
      setIsContent("");
      setImageFiles([]);
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

  const handleDeleteImage = () => {
    setImageFiles([]);
  };

  return (
    <form className="post_form" onSubmit={onSubmit}>
      <PostHeader />
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
        <input type="submit" value="수정" className="post_form--submit-btn" />
      </div>
    </form>
  );
};
