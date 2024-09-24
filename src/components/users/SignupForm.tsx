import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { app } from "firebaseApp"; // import 경로 확인 잘하기
import { toast } from "react-toastify";

const SignupForm = () => {
  const [isError, setIsError] = useState<string | null>(null);
  const [isEmail, setIsEmail] = useState<string>("");
  const [isPassword, setIsPassword] = useState<string>("");
  const [isPasswordCheck, setIsPasswordCheck] = useState<string>("");

  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, isEmail, isPassword);
      navigate("/");
      toast.success("성공적으로 회원가입이 되었습니다.");
    } catch (error: any) {
      toast.error(error?.code);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setIsEmail(value);

      const validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

      if (!value?.match(validRegex)) {
        setIsError("이메일 형식이 올바르지 않습니다.");
      } else {
        setIsError(null);
      }
    }

    if (name === "password") {
      setIsPassword(value);

      if (value?.length < 8) {
        setIsError("비밀번호는 8자리 이상이어야 합니다.");
      } else {
        setIsError(null);
      }

      // if (value !== isPasswordCheck) {
      //   setIsError("비밀번호를 다시 한 번 확인하세요.");
      // }
    }

    if (name === "password_confirmation") {
      setIsPasswordCheck(value);

      if (value !== isPassword) {
        setIsError("비밀번호를 다시 한 번 확인하세요.");
      } else {
        setIsError(null);
      }
    }
  };

  const onClickSocialLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const auth = getAuth(app);
      let provider;
      const target = e.target as HTMLButtonElement;

      if (target.name === "google") {
        provider = new GoogleAuthProvider();
      }

      if (target.name === "github") {
        provider = new GithubAuthProvider();
      }

      const signUpInfo = await signInWithPopup(
        auth,
        provider as GoogleAuthProvider | GithubAuthProvider
      );

      toast.success("로그인 되었습니다.");
      navigate("/");

      console.log("signUpInfo : ", signUpInfo);
    } catch (error) {
      console.log(error);
      toast.error(`로그인에 실패하였습니다. `);
    }
  };

  return (
    <form className="form form--lg" onSubmit={onSubmit}>
      <div className="form__title">회원가입</div>
      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input
          type="text"
          name="email"
          id="email"
          value={isEmail}
          onChange={onChange}
          required
        />
      </div>
      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          name="password"
          id="password"
          value={isPassword}
          onChange={onChange}
          required
        />
      </div>
      <div className="form__block">
        <label htmlFor="password_confirmation">비밀번호 확인</label>
        <input
          type="password"
          name="password_confirmation"
          id="password_confirmation"
          value={isPasswordCheck}
          onChange={onChange}
          required
        />
      </div>

      {isError && isError.length > 0 && (
        <div className="form__block">
          <div className="form__error">{isError}</div>
        </div>
      )}

      <div className="form__block">
        계정이 있으신가요?
        <Link to="/login" className="form__link">
          로그인하기
        </Link>
      </div>
      <div className="form__block">
        <button
          type="submit"
          className="form__btn--submit"
          disabled={(isError?.length as number) > 0}>
          회원가입
        </button>
      </div>
      <div className="form__block">
        <button
          type="button"
          name="google"
          className="form__btn--google"
          onClick={onClickSocialLogin}>
          Google로 회원가입
        </button>
      </div>
      <div className="form__block">
        <button
          type="button"
          name="github"
          className="form__btn--github"
          onClick={onClickSocialLogin}>
          Github로 회원가입
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
