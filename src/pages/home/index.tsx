import { PostBox } from "components/posts/PostBox";
import { PostForm } from "../../components/posts/PostForm";
import { useCallback, useContext, useState } from "react";
import { useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  where,
} from "firebase/firestore";
import AuthContext from "context/AuthContext";
import { db } from "firebaseApp";
import { UserProps } from "components/following/FollowingBox";
import { useRecoilState } from "recoil";
import { languageState } from "atom";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comment?: any;
  hashtags?: string[];
  imageUrl?: string[];
  displayName?: string;
}

type TabType = "all" | "following";

const HomePage = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [followingPosts, setFollowingPosts] = useState<PostProps[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([""]);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const { user } = useContext(AuthContext);

  const [language, setLanguage] = useRecoilState(languageState);

  // console.log(followingIds);

  // 실시간 동기화로 user의 팔로잉 id 배열 가져오기
  const getFollowingIds = useCallback(async () => {
    if (user?.uid) {
      const ref = doc(db, "following", user?.uid);
      onSnapshot(ref, (doc) => {
        setFollowingIds([""]);
        doc?.data()?.users.map((user: UserProps) => {
          if (user?.id) {
            setFollowingIds((prev) => [...prev, user.id]);
          }
        });
      });
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) getFollowingIds();
  }, [getFollowingIds]);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postsQuery = query(postsRef, orderBy("createdAt", "desc"));
      let followingQuery = query(
        postsRef,
        where("uid", "in", followingIds),
        orderBy("createdAt", "desc")
      );

      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));

        setPosts(dataObj as PostProps[]);
      });

      onSnapshot(followingQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));

        setFollowingPosts(dataObj as PostProps[]);
      });
    }
  }, [user, followingIds]);

  const handleChangeLanguage = () => {
    language === "ko" ? setLanguage("en") : setLanguage("ko");
    localStorage.setItem("language", language === "ko" ? "en" : "ko");
  };

  return (
    <div className="home">
      <div className="home__top">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="home__title">Home</div>
          <button
            style={{ border: "none", cursor: "pointer" }}
            onClick={handleChangeLanguage}
          >
            Language: {language}
          </button>
        </div>
        <div className="home__tabs">
          <div
            className={`home__tab ${
              activeTab === "all" && "home__tab--active"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All
          </div>
          <div
            className={`home__tab ${
              activeTab === "following" && "home__tab--active"
            }`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </div>
        </div>
      </div>

      {/* post form */}
      <PostForm />

      {/* posts Lists */}
      {activeTab === "all" && (
        <div className="post">
          {posts.length > 0 ? (
            posts?.map((post, idx) => (
              <PostBox post={post} key={`post ${idx}`} />
            ))
          ) : (
            <div className="post__no-posts">
              <p className="post__text">게시글이 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "following" && (
        <div className="post">
          {followingPosts.length > 0 ? (
            followingPosts?.map((post, idx) => (
              <PostBox post={post} key={`post ${idx}`} />
            ))
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

export default HomePage;
