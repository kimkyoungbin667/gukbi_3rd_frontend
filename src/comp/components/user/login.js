import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, kakaoLogin } from "../../api/user"; // 로그인 API 호출 함수 import
import "../../css/user/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init("5eb58fa73fc5691112750151fa475971"); // 카카오 SDK 초기화 (JavaScript 키 사용)
      console.log("Kakao SDK Initialized");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(email, password); // 일반 로그인 API 호출
      const { token } = response.data;

      alert("로그인 성공!");
      localStorage.setItem("token", token); // JWT 저장
      navigate("/"); // 대시보드 등으로 이동
    } catch (error) {
      console.error("로그인 실패:", error.response?.data || error.message);
      alert(error.response?.data?.message || "로그인에 실패했습니다.");
    }
  };

  const handleKakaoLogin = async () => {
    window.Kakao.Auth.login({
      success: async (authObj) => {
        try {
          const response = await kakaoLogin(authObj.access_token); // 백엔드 API 호출
          const { token } = response.data;
  
          console.log("카카오 로그인 성공:", response.data);
          localStorage.setItem("token", token); // JWT 저장
          alert("카카오 로그인 성공!");
          navigate("/"); // 대시보드 등으로 이동
        } catch (error) {
          console.error("카카오 로그인 처리 실패:", error.response?.data || error.message);
        }
      },
      fail: (err) => {
        console.error("카카오 로그인 실패:", err);
        alert("카카오 로그인에 실패했습니다.");
      },
    });
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
      <div className="kakao-login-container">
        <button className="kakao-login-button" onClick={handleKakaoLogin}>
          카카오 로그인
        </button>
      </div>
    </div>
  );
}
