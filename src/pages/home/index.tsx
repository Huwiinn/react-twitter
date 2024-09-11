import { FiImage } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaUserCircle, FaHeart, FaComment } from "react-icons/fa";

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
}

const posts: PostProps[] = [
  {
    id: "테스트 아이디1",
    email: "test@gmail.com",
    content: "오늘은 전포동에 가요~",
    createdAt: "2024.08.07",
    uid: "testUID",
  },
  {
    id: "테스트 아이디2",
    email: "test@gmail.com",
    content: "오늘은 전포동에 가요~",
    createdAt: "2024.08.07",
    uid: "testUID",
  },
  {
    id: "테스트 아이디3",
    email: "test@gmail.com",
    content: "오늘은 전포동에 가요~",
    createdAt: "2024.08.07",
    uid: "testUID",
  },
  {
    id: "테스트 아이디4",
    email: "test@gmail.com",
    content: "오늘은 전포동에 가요~",
    createdAt: "2024.08.07",
    uid: "testUID",
  },
  {
    id: "테스트 아이디5",
    email: "test@gmail.com",
    content: "오늘은 전포동에 가요~",
    createdAt: "2024.08.07",
    uid: "testUID",
  },
  {
    id: "테스트 아이디6",
    email: "test@gmail.com",
    content: "오늘은 전포동에 가요~",
    createdAt: "2024.08.07",
    uid: "testUID",
  },
  {
    id: "테스트 아이디7",
    email: "test@gmail.com",
    content: "오늘은 전포동에 가요~",
    createdAt: "2024.08.07",
    uid: "testUID",
  },
];

const HomePage = () => {
  const handleFileUpload = () => {
    console.log("파일 업로드~");
  };

  const handleDelete = () => {
    console.log("게시글 삭제~");
  };

  return (
    <div className="home">
      <div className="home__title">Home</div>
      <div className="home__tabs">
        <div className="home__tab home__tab--active">For U</div>
        <div className="home__tab">Following</div>
      </div>

      {/* post form */}
      <form className="post_form">
        <textarea
          className="post_form--textarea"
          required
          name="content"
          id="content"
          placeholder="What's happening?"
        />
        <div className="post_form--submit-area">
          <label htmlFor="file-input" className="post_form--file">
            <FiImage className="post_form--file-icon" />
          </label>
          <input
            type="file"
            id="file-input"
            name="file-input"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="이미지 업로드"
          />
          <input
            type="submit"
            value="Tweet"
            className="post_form--submit-btn"
          />
        </div>
      </form>

      {/* posts Lists */}
      <div className="post">
        {posts.map((post) => (
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
        ))}
      </div>
    </div>
  );
};

export default HomePage;
