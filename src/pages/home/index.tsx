import { PostBox } from "components/posts/PostBox";
import { PostForm } from "../../components/posts/PostForm";
import { useContext, useState } from "react";
import { useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import AuthContext from "context/AuthContext";
import { db } from "firebaseApp";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
  hashtags?: string[];
  imageUrl?: string[];
}

const HomePage = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postsQuery = query(postsRef, orderBy("createdAt", "desc"));

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
        <div className="home__title">Home</div>
        <div className="home__tabs">
          <div className="home__tab home__tab--active">For U</div>
          <div className="home__tab">Following</div>
        </div>
      </div>

      {/* post form */}
      <PostForm />

      {/* posts Lists */}
      <div className="post">
        {posts.length > 0 ? (
          posts?.map((post, idx) => <PostBox post={post} key={`post ${idx}`} />)
        ) : (
          <div className="post__no-posts">
            <p className="post__text">게시글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
