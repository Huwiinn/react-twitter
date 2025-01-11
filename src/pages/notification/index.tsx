import NotificationBox from "components/notifications/NotificationBox";
import AuthContext from "context/AuthContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useEffect, useState } from "react";

export interface NotificationProps {
  id: string;
  uid: string;
  url: string;
  isRead: boolean;
  content: string;
  createdAt: string;
}

const NotificationPage = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  useEffect(() => {
    if (user) {
      let ref = collection(db, "notifications");
      let notificationQuery = query(
        ref,
        where("uid", "==", user?.uid),
        orderBy("createdAt", "desc")
      );

      onSnapshot(notificationQuery, (snapShop) => {
        let dataObj = snapShop.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setNotifications(dataObj as NotificationProps[]);
      });
    }
  }, []);

  // console.log("notifications : ", notifications);
  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">
          <div className="hoome__title-text">Notification</div>
        </div>
        <div className="post">
          {notifications?.length > 0 ? (
            notifications.map((noti) => <NotificationBox notification={noti} />)
          ) : (
            <div className="post__no-posts">
              <p className="post__text">알림이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
