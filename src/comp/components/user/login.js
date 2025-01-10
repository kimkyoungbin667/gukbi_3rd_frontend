import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, kakaoLogin, getUserNickname } from "../../api/user";
import { useAuth } from "../../../AuthContext"; // AuthContext 사용
import "../../css/user/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth(); // 상태 업데이트 함수 가져오기

  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init("5eb58fa73fc5691112750151fa475971");
      console.log("Kakao SDK Initialized");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(email, password);
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setIsLoggedIn(true); // 로그인 상태 업데이트

      const nicknameResponse = await getUserNickname(accessToken);
      const nickname = nicknameResponse.data;

      navigate(nickname ? "/" : "/profilesetup");

      alert("로그인 성공!");

      // 로그인 성공 시 토큰 저장
      localStorage.setItem("token", accessToken); // JWT 토큰만 저장

      navigate("/"); // 대시보드 등 다음 페이지로 이동
    } catch (error) {
      console.error("로그인 실패:", error.response?.data || error.message);
      alert("로그인에 실패했습니다.");
    }
  };

  const handleKakaoLogin = async () => {
    window.Kakao.Auth.login({
      success: async (authObj) => {
        try {
          const response = await kakaoLogin(authObj.access_token);
          const { accessToken, refreshToken } = response.data;

          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          setIsLoggedIn(true); // 로그인 상태 업데이트

          const nicknameResponse = await getUserNickname(accessToken);
          const nickname = nicknameResponse.data;

          navigate(nickname ? "/" : "/profilesetup");
        } catch (error) {
          console.error("카카오 로그인 실패:", error.response?.data || error.message);
          alert("카카오 로그인에 실패했습니다.");
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
        <button type="submit" className="login-button">로그인</button>
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
