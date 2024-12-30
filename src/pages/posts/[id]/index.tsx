import { useCallback, useEffect, useState } from "react";
import { PostProps } from "pages/home";
import { PostBox } from "components/posts/PostBox";
import Loader from "../../../components/loader/Loader";
import { useParams } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "firebaseApp";
import PostHeader from "components/posts/PostHeader";
import CommentForm from "components/comments/CommentForm";
import CommentBox, { CommentProps } from "components/comments/CommentBox";

const PostDetailPage = () => {
  const [post, setPost] = useState<PostProps | null>(null);
  const params = useParams();

  const getPost = useCallback(async () => {
    if (params.id) {
      const postRef = doc(db, "posts", params.id as string);
      onSnapshot(postRef, (doc) => {
        setPost({ ...(doc?.data() as PostProps), id: doc.id });
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      getPost();
    }
  }, [params.id, getPost]);

  return (
    <div className="post">
      <PostHeader />
      {post ? (
        <>
          <PostBox post={post} />
          <CommentForm post={post} />
          {post?.comment
            ?.slice(0)
            .reverse()
            .map((data: CommentProps, index: number) => (
              <CommentBox data={data} post={post} key={index} />
            ))}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default PostDetailPage;
