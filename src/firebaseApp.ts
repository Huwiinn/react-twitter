import { initializeApp, FirebaseApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export let app: FirebaseApp; // FirebaseApp 인스턴스 타입 할당

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

try {
  // getApp 메서드는 특정 이름("app")으로 Firebase가 이미 초기화되었는지 확인하는데 사용된다.
  // 만약 해당 이름으로 초기화된 앱이 없으면 예외가 발생한다.
  // 이를 통해 동일한 Firebase 앱이 여러 번 초기화되는 것을 방지할 수 있다.
  app = getApp("app");
} catch (err) {
  // 예외가 발생하면 Firebase 앱이 초기화되지 않았음을 의미하므로 새로 초기화한다.
  app = initializeApp(firebaseConfig, "app");
}

// 이 부분은 주의가 필요하다. 이미 "app" 이름으로 Firebase가 초기화된 상태에서
// 다시 initializeApp을 호출하면 오류가 발생할 수 있다.
const firebase = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export default firebase;
