import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "firebaseApp"; // import 경로 확인 잘하기
import { toast } from "react-toastify";

const LoginForm = () => {
  const [isError, setIsError] = useState<string | null>(null);
  const [isEmail, setIsEmail] = useState<string>("");
  const [isPassword, setIsPassword] = useState<string>("");

  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, isEmail, isPassword);
      navigate("/");
      toast.success("로그인 되었습니다.");
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
    }
  };

  return (
    <form className="form form--lg" onSubmit={onSubmit}>
      <div className="form__title">로그인</div>
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

      {isError && isError.length > 0 && (
        <div className="form__block">
          <div className="form__error">{isError}</div>
        </div>
      )}

      <div className="form__block">
        계정이 없으신가요?
        <Link to="/users/signup" className="form__link">
          회원가입하기
        </Link>
      </div>
      <div className="form__block">
        <button
          type="submit"
          className="form__btn--submit"
          disabled={(isError?.length as number) > 0}>
          로그인
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
