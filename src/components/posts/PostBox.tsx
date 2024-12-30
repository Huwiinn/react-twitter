import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaHeart, FaComment } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { PostProps } from "pages/home";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import {
  doc,
  deleteDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db, storage } from "firebaseApp";
import { toast } from "react-toastify";
import { ref, deleteObject } from "firebase/storage";

type postBoxProps = {
  post: PostProps;
};

// props 전달받는 부분 헷갈럈던 부분 Note
// { post }: postBoxProps => 구조분해할당하여 곧바로 post로 사용가능.
// post: postBoxProps => post를 사용하려면 props.post로 해당 props 사용가능.
// 즉, 타입을 지정할 때에 { post }: postBoxProps 이런식으로 설정하면 내가 받은 post props의 타입을 곧바로 명시하는 것임
export const PostBox = ({ post }: postBoxProps) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // const imgRef = post?.imageUrl?.map((image) => {
  //   return ref(storage, image);
  // });

  const handleDelete = async () => {
    try {
      const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");

      if (confirm) {
        // 스토리지에서 이미지 삭제
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

        await deleteDoc(doc(db, "posts", post.id as string));
        toast.success("게시글을 삭제하였습니다.");
        navigate("/");
      }
    } catch (error) {
      console.error(`게시글 삭제 실패 : ${error}`);
      toast.error(`게시글 삭제 실패 : ${error}`);
    }
  };

  // console.log({ post });

  const toggleLike = async () => {
    const postRef = doc(db, "posts", post.id);

    if (user?.uid && post?.likes?.includes(user?.uid)) {
      // 좋아요를 이미 물렀을 때 취소
      await updateDoc(postRef, {
        likes: arrayRemove(user?.uid),
        likeCount: post.likeCount ? post.likeCount - 1 : 0,
      });
    } else {
      // 새롭게 좋아요를 했을 경우
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post.likeCount ? post.likeCount + 1 : 1,
      });
    }
  };

  return (
    <div className="post_box" key={post.id}>
      <Link to={`/posts/${post?.id}`}>
        <div className="post_box--profile">
          {post?.profileUrl ? (
            <img
              src={post?.profileUrl}
              alt="프로필 이미지"
              className="post_box--profile-img"
            />
          ) : (
            <FaUserCircle className="post_box--profile-icon" />
          )}
          <div className="post_email">{post?.email}</div>
          <div className="post_createAd">{post?.createdAt}</div>
        </div>
        {post?.imageUrl &&
          post?.imageUrl?.length >= 1 &&
          post?.imageUrl?.map((image) => (
            <div className="post__image-div">
              <img
                src={image}
                width={550}
                height={350}
                alt="포스트 업로드 이미지"
                className="post__image"
              />
            </div>
          ))}
        <div className="post_box--content">{post?.content}</div>
        <div className="post_form__hashtags-outputs">
          {post?.hashtags?.map((tag, idx) => (
            <span className="post_form__hashtags-tag" key={`${idx}-${tag}`}>
              #{tag}
            </span>
          ))}
        </div>
      </Link>
      <div className="post_box--footer">
        {/* post.uid === user.uid 일 때 */}
        {post?.uid === user?.uid && (
          <>
            <button
              type="button"
              className="post_delete"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button type="button" className="post_edit">
              <Link to={`/posts/edit/${post?.id}`}>Edit</Link>
            </button>
          </>
        )}
        <>
          <button type="button" className="post_likes" onClick={toggleLike}>
            {user && post?.likes?.includes(user.uid) ? (
              <FaHeart />
            ) : (
              <AiOutlineHeart />
            )}
            {post?.likeCount || 0}
          </button>
          <button type="button" className="post_comments">
            <FaComment />
            {post?.comment?.length || 0}
          </button>
        </>
      </div>
    </div>
  );
};
