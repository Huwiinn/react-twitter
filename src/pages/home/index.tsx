import { PostBox } from "components/posts/PostBox";
import { PostForm } from "../../components/posts/PostForm";

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
  return (
    <div className="home">
      <div className="home__title">Home</div>
      <div className="home__tabs">
        <div className="home__tab home__tab--active">For U</div>
        <div className="home__tab">Following</div>
      </div>

      {/* post form */}
      <PostForm />

      {/* posts Lists */}
      <div className="post">
        {posts?.map((post, idx) => (
          <PostBox post={post} key={`post ${idx}`} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
