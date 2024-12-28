import { useState, useContext, useEffect, useRef } from "react";
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

type ActiveTabType = "my" | "like";
const PROFILE_DEFAULT_URL = "/logo192.png";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>("my");
  const [myPosts, setMyPosts] = useState<PostProps[]>([]);
  const [likePosts, setLikePosts] = useState<PostProps[]>([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const tabRef = useRef(null);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      const myPostsQuery = query(
        postsRef,
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const likePostsQuery = query(
        postsRef,
        where("likes", "array-contains", user.uid),
        orderBy("createdAt", "desc")
      );

      onSnapshot(myPostsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));

        console.log("dataObj : ", dataObj);
        setMyPosts(dataObj as PostProps[]);
      });

      onSnapshot(likePostsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));

        console.log("dataObj : ", dataObj);
        setLikePosts(dataObj as PostProps[]);
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
          <div
            className={`home__tab ${activeTab === "my" && "home__tab--active"}`}
            onClick={() => setActiveTab("my")}
          >
            For U
          </div>
          <div
            className={`home__tab ${
              activeTab === "like" && "home__tab--active"
            }`}
            onClick={() => setActiveTab("like")}
          >
            Likes
          </div>
        </div>
      </div>
      {activeTab === "my" && (
        <div className="post">
          {myPosts?.length > 0 ? (
            myPosts.map((post) => <PostBox post={post} key={post.id} />)
          ) : (
            <div className="post__no-posts">
              <p className="post__text">게시글이 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "like" && (
        <div className="post">
          {likePosts?.length > 0 ? (
            likePosts.map((post) => <PostBox post={post} key={post.id} />)
          ) : (
            <div className="post__no-posts">
              <p className="post__text">게시글이 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

// ----------------------------------

// import { useSyncExternalStore } from "react";

// function subscribe(callback : (this: Window, ev: UIEvent) => void) {
//   window.addEventListener('resize', callback);
//   return () => {
//     window.removeEventListener('resize', callback);
//   }
// }

// function useWindowWidth() {
//   return useSyncExternalStore(
//     subscribe,
//     () => window.innerWidth,
//     () => 0
//   );
// }

// export default function App() {
//   const windowSize = useWindowWidth();
//   return <>{windowSize}</>
// }
