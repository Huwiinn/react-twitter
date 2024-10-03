import { Link } from "react-router-dom";
import { FaUserCircle, FaHeart, FaComment } from "react-icons/fa";
import { PostProps } from "pages/home";
import { useContext } from "react";
import AuthContext from "context/AuthContext";

type postBoxProps = {
  post: PostProps;
};

// props 전달받는 부분 헷갈럈던 부분 Note
// { post }: postBoxProps => 구조분해할당하여 곧바로 post로 사용가능.
// post: postBoxProps => post를 사용하려면 props.post로 해당 props 사용가능.
// 즉, 타입을 지정할 때에 { post }: postBoxProps 이런식으로 설정하면 내가 받은 post props의 타입을 곧바로 명시하는 것임
export const PostBox = ({ post }: postBoxProps) => {
  const { user } = useContext(AuthContext);
  const handleDelete = () => {
    console.log("게시글 삭제~");
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
        <div className="post_box--content">{post?.content}</div>
      </Link>
      <div className="post_box--footer">
        {/* post.uid === user.uid 일 때 */}
        {post?.uid === user?.uid && (
          <>
            <button
              type="button"
              className="post_delete"
              onClick={handleDelete}>
              Delete
            </button>
            <button type="button" className="post_edit">
              <Link to={`/posts/edit/${post?.id}`}>Edit</Link>
            </button>
          </>
        )}
        <>
          <button type="button" className="post_likes">
            <FaHeart />
            {post?.likeCount || 0}
          </button>
          <button type="button" className="post_comments">
            <FaComment />
            {post?.comments?.length || 0}
          </button>
        </>
      </div>
    </div>
  );
};
