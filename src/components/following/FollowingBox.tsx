import AuthContext from "context/AuthContext";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface FollowingProps {
  post: PostProps;
}

export interface UserProps {
  id: string;
}

const FollowingBox = ({ post }: FollowingProps) => {
  const { user } = useContext(AuthContext);
  const [postFollowers, setPostFollowers] = useState<any>([]);

  const onClickFollow = async (e: any) => {
    e.preventDefault();

    try {
      if (user?.uid) {
        // 내가 주체가 되어 팔로잉 컬렉션 생성 또는 업데이트
        const followingRef = doc(db, "following", user?.uid);

        await setDoc(followingRef, {
          users: arrayUnion({ id: post?.uid }, { merge: true }),
        });

        // 팔로우 당하는 사람이 주체가 되어 팔로우 컬렉션 생성 또는 업데이트
        const followerRef = doc(db, "follower", post?.uid);
        await setDoc(followerRef, {
          users: arrayUnion({ id: user?.uid }, { merge: true }),
        });

        // 팔로잉 알림 생성
        await addDoc(collection(db, "notifications"), {
          createdAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          uid: post?.uid,
          isRead: false,
          url: `#`,
          content: `${user.email || user.displayName}님이 팔로우 했습니다.`,
        });
        toast.success("팔로우 성공!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onClickDeleteFollow = async (e: any) => {
    e.preventDefault();

    try {
      if (user?.uid) {
        const followingRef = doc(db, "following", user?.uid);
        await updateDoc(followingRef, {
          users: arrayRemove({ id: post?.uid }),
        });

        const followerRef = doc(db, "follower", post?.uid);
        await updateDoc(followerRef, {
          users: arrayRemove({ id: user?.uid }),
        });

        toast.success("팔로우 제거 성공!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getFollower = useCallback(async () => {
    try {
      if (post.uid) {
        const ref = doc(db, "follower", post.uid);
        onSnapshot(ref, (doc) => {
          setPostFollowers([]);
          doc
            ?.data()
            ?.users?.map((user: UserProps) =>
              setPostFollowers((prev: UserProps[]) =>
                prev ? [...prev, user?.id] : []
              )
            );
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [post.uid]);

  useEffect(() => {
    if (post?.uid) {
      getFollower();
    }
  }, [getFollower, post.uid]);

  return (
    <>
      {user?.uid !== post.uid &&
        (postFollowers?.includes(user?.uid) ? (
          <button
            className="post_following-btn"
            type="button"
            onClick={onClickDeleteFollow}
          >
            Following
          </button>
        ) : (
          <button
            className="post_follow-btn"
            type="button"
            onClick={onClickFollow}
          >
            Follow
          </button>
        ))}
    </>
  );
};

export default FollowingBox;
