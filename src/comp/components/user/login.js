import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/user"; // 로그인 API 호출 함수 import
import "../../css/user/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(email, password); // 로그인 API 호출
      console.log("로그인 성공:", response.data);

      const { token } = response.data;

      alert("로그인 성공!");
      
      // 로그인 성공 시 토큰 저장
      localStorage.setItem("token", token); // JWT 토큰만 저장
      
      navigate("/"); // 대시보드 등 다음 페이지로 이동
    } catch (error) {
      console.error("로그인 실패:", error.response?.data || error.message);
      alert(error.response?.data?.message || "로그인에 실패했습니다.");
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
        <button
          type="button"
          className="register-button"
          onClick={() => navigate("/registerbutton")}
        >
          회원가입
        </button>
      </form>
    </div>
  );
}
