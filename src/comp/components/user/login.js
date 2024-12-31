import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // 페이지 이동을 위한 React Router 훅

  const handleLogin = (e) => {
    e.preventDefault();

    // 간단한 로그인 로직
    if (email === "test@example.com" && password === "password") {
      console.log("로그인 성공:", { email });
      alert("로그인 성공!");
      navigate("/dashboard"); // 로그인 후 대시보드로 이동
    } else {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          로그인
        </button>
        <button type="submit" className="register-button" onClick={() => navigate("/registerbutton")}>
          회원가입
        </button>
      </form>
    </div>
  );
}
