import Router from "components/Router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "firebaseApp";
import { useEffect, useState } from "react";
import Layout from "components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./components/loader/Loader";
import { RecoilRoot } from "recoil";

function App() {
  const auth = getAuth(app);
  const [isAuth, setIsAuth] = useState<boolean>(
    !!auth?.currentUser ? true : false
  );
  const [init, setInit] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      user ? setIsAuth(true) : setIsAuth(false);
    });

    setInit(true);
  }, [auth]);

  return (
    <RecoilRoot>
      <Layout>
        <ToastContainer
          theme="dark"
          autoClose={1000}
          hideProgressBar
          newestOnTop
        />
        {init ? <Router isAuth={isAuth} /> : <Loader />}
      </Layout>
    </RecoilRoot>
  );
}

export default App;
