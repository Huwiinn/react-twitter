import { useCallback, useEffect, useState } from "react";
import { PostProps } from "pages/home";
import { PostBox } from "components/posts/PostBox";
import Loader from "../../../components/loader/Loader";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import PostHeader from "components/posts/PostHeader";

const PostDetailPage = () => {
  const [post, setPost] = useState<PostProps | null>(null);
  const params = useParams();

  const getPost = useCallback(async () => {
    if (params.id) {
      const postRef = doc(db, "posts", params.id as string);
      const postSnap = await getDoc(postRef);

      setPost({ ...(postSnap?.data() as PostProps), id: postSnap?.id });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      getPost();
    }
  }, [params.id, getPost]);

  console.log(post);

  return (
    <div className="post">
      <PostHeader />
      {post ? <PostBox post={post} /> : <Loader />}
    </div>
  );
};

export default PostDetailPage;
