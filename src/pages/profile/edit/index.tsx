import { useContext, useEffect, useState } from "react";
import PostHeader from "../../../components/posts/PostHeader";
import { FiImage } from "react-icons/fi";
import AuthContext from "context/AuthContext";
import {
  getStorage,
  ref,
  deleteObject,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "firebaseApp";
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileEditPage = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;

    setDisplayName(value);
  };

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      // console.log(111, result);
      setImageUrl(result);
    };
  };

  const handleDeleteImage = () => {
    setImageUrl("");
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    let key = `${user?.uid}/${uuidv4()}`;
    // 새로운 ref 생성
    const storageRef = ref(storage, key);
    let newImageUrl: string | null = null;

    try {
      // 기존 이미지 삭제
      // if (user?.photoURL) {
      //   const imageRef = ref(storage, user?.photoURL);
      //   await deleteObject(imageRef).catch((error) => {
      //     console.log("기존 이미지 삭제 에러 : ", error);
      //   });
      // }
      // 이미지 업로드
      if (imageUrl) {
        const data = await uploadString(storageRef, imageUrl, "data_url");
        newImageUrl = await getDownloadURL(data?.ref);
      }
      // updateProfile 호출
      if (user) {
        await updateProfile(user, {
          displayName: displayName || "",
          photoURL: newImageUrl || "",
        })
          .then(() => {
            toast.success("프로필이 업데이트 되었습니다.");
            navigate("/profile");
          })
          .catch((error) => {
            console.log("프로필 업데이트 중, 에러 발생: ", error);
          });
      }
    } catch (error: any) {
      console.log("수정기능 에러 발생", error);
    }
  };

  useEffect(() => {
    if (user?.photoURL) {
      setImageUrl(user.photoURL);
    }

    if (user?.displayName) {
      setDisplayName(user?.displayName);
    }
  }, [user]);

  return (
    <div className="post">
      <PostHeader />
      <form className="post-form" onSubmit={onSubmit}>
        <div className="post-form__profile">
          <input
            type="text"
            name="displayName"
            className="post-form__input"
            placeholder="이름"
            onChange={onChange}
            value={displayName}
          />
          {imageUrl && (
            <div className="post-form__attachment">
              <img
                src={imageUrl}
                alt="수정하려는 이미지"
                width={100}
                height={100}
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="post_form__clear-btn"
              >
                삭제
              </button>
            </div>
          )}

          <div className="post_form--submit-area">
            <div className="post-form__image-area">
              <label htmlFor="file-input" className="post_form--file">
                <FiImage className="post-form__file-icon" />
              </label>
            </div>
            <input
              type="file"
              id="file-input"
              name="file-input"
              aria-label="file-input"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
          <input
            type="submit"
            value="프로필 수정"
            className="post_form--submit-btn"
          />
        </div>
      </form>
    </div>
  );
};

export default ProfileEditPage;
