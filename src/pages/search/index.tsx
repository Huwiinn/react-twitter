import { PostBox } from "components/posts/PostBox";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import AuthContext from "context/AuthContext";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { query } from "firebase/firestore";

const SearchPage = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [tagQuery, setTagQuery] = useState<string>("");
  const { user } = useContext(AuthContext);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagQuery(e.target.value.trim());
  };

  console.log(tagQuery);

  useEffect(() => {
    if (user) {
      // input에 아무것도 없을 때, 초기화
      if (tagQuery === "") {
        setPosts([]);
      }

      let postsRef = collection(db, "posts");
      let postsQuery = query(
        postsRef,
        where("hashtags", "array-contains-any", [tagQuery]),
        orderBy("createdAt", "desc")
      );

      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setPosts(dataObj as PostProps[]);
      });
    }
  }, [tagQuery, user]);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">
          <div className="home___title-text">Search</div>
        </div>
        <div className="home__search-div">
          <input
            className="home__search"
            placeholder="해시태그 검색"
            type="text"
            onChange={onChange}
          />
        </div>
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
      </div>
    </div>
  );
};

export default SearchPage;
