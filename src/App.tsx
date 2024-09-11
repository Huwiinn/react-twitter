import Router from "components/Router";
import { getAuth } from "firebase/auth";
import { app } from "firebaseApp";
import { useState } from "react";
import Layout from "components/Layout";

function App() {
  const auth = getAuth(app);
  const [isAuth, setIsAuth] = useState<boolean>(
    !!auth?.currentUser ? true : false
  );

  return (
    <Layout>
      <Router />
    </Layout>
  );
}

export default App;
