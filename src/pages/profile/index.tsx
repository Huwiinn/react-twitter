import { useState, useContext, useEffect } from "react";
import AuthContext from "context/AuthContext";
import { PostProps } from "../home/index";
import { PostBox } from "../../components/posts/PostBox";
import {
  collection,
  where,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { useNavigate } from "react-router-dom";

const PROFILE_DEFAULT_URL = "/logo192.png";

const ProfilePage = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postsQuery = query(
        postsRef,
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));

        console.log("dataObj : ", dataObj);
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [user]);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">Profile</div>
        <div className="profile">
          <img
            src={user?.photoURL || PROFILE_DEFAULT_URL}
            alt="프로필 사진"
            className="profile__image"
            width={100}
            height={100}
          />
          <button
            className="profile__btn"
            type="button"
            onClick={() => navigate("/profile/edit")}
          >
            프로필 수정
          </button>
        </div>
        <div className="profile__text">
          <div className="profile__name">
            {`${user?.displayName}님` || "사용자님"}
          </div>
          <div className="profile__email">{`${user?.email}`}</div>
        </div>
        <div className="home__tabs">
          <div className="home__tab home__tab--active">For U</div>
          <div className="home__tab">Likes</div>
        </div>
      </div>
      <div className="post">
        {posts?.length > 0 ? (
          posts.map((post) => <PostBox post={post} key={post.id} />)
        ) : (
          <div className="post__no-posts">
            <p className="post__text">게시글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
