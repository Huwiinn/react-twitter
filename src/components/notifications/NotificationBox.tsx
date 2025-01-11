import { doc, updateDoc } from "firebase/firestore";
import { NotificationProps } from "../../pages/notification/index";
import { useNavigate } from "react-router-dom";
import { db } from "firebaseApp";
import styles from "./Notification.module.scss";

export default function NotificationBox({
  notification,
}: {
  notification: NotificationProps;
}) {
  const navigate = useNavigate();

  const onClickNotification = async (url: string) => {
    // isRead 업데이트
    if (url) {
      const ref = doc(db, "notifications", notification.id);
      await updateDoc(ref, {
        isRead: true,
      });
    }

    // url로 이동
    navigate(`/${url}`);
  };

  return (
    <div key={notification.id} className={styles.notification}>
      <div
        onClick={() => {
          onClickNotification(notification?.url);
        }}
      >
        <div className={styles.notification__flex}>
          <div className={styles.notification__createdAt}>
            {notification?.createdAt}
          </div>
          {notification?.isRead === false && (
            <div className={styles.notification__unread} />
          )}
        </div>
        <div className={styles.notification__content}>
          {notification.content}
        </div>
      </div>
    </div>
  );
}
