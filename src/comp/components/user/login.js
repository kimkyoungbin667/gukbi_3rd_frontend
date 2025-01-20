import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, kakaoLogin, getUserNickname } from "../../api/user";
import { useAuth } from "../../../AuthContext"; // AuthContext 사용
import AlertBox from "../general/alertbox"; // AlertBox import
import "../../css/user/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState(""); // AlertBox 메시지 상태
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
      console.log("서버 응답 데이터:", response.data); // 디버깅용

      const { accessToken, refreshToken, isAdmin, isActive } = response.data;

      const isAdminBool = isAdmin === "true" || isAdmin === true;
      const isActiveBool = isActive === "true" || isActive === true;

      if (!isActiveBool) {
        setAlertMessage("비활성화된 계정입니다. 관리자에게 문의하세요.");
        return;
      }

      if (isAdminBool) {
        setAlertMessage("관리자 계정입니다. 관리자 페이지로 이동합니다.");
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setIsLoggedIn(true);
        navigate("/admin-dashboard"); // 관리자 페이지로 이동
        return;
      }

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setIsLoggedIn(true);

      // 닉네임 가져오기
      const nicknameResponse = await getUserNickname();
      const nickname = nicknameResponse.data;

      // 닉네임이 없으면 닉네임 설정 페이지로 이동
      if (!nickname || nickname.trim() === "") {
        navigate("/profilesetup"); // 닉네임 설정 페이지로 이동
      } else {
        navigate("/"); // 일반 사용자 대시보드로 이동
      }

      setAlertMessage("로그인 성공!");
    } catch (error) {
      console.error("로그인 실패:", error.response?.data || error.message);
      setAlertMessage("로그인에 실패했습니다.");
    }
  };

  const handleKakaoLogin = async () => {
    window.Kakao.Auth.login({
      success: async (authObj) => {
        try {
          const response = await kakaoLogin(authObj.access_token);
          const { accessToken, refreshToken, isAdmin, isActive } = response.data;

          const isAdminBool = isAdmin === "true" || isAdmin === true;
          const isActiveBool = isActive === "true" || isActive === true;

          if (!isActiveBool) {
            setAlertMessage("비활성화된 계정입니다. 관리자에게 문의하세요.");
            return;
          }

          if (isAdminBool) {
            setAlertMessage("관리자 계정입니다. 관리자 페이지로 이동합니다.");
            navigate("/admin-dashboard");
            return;
          }

          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          setIsLoggedIn(true);

          // 닉네임 가져오기
          const nicknameResponse = await getUserNickname();
          const nickname = nicknameResponse.data;

          // 닉네임이 없으면 닉네임 설정 페이지로 이동
          if (!nickname || nickname.trim() === "") {
            navigate("/profilesetup");
          } else {
            navigate("/");
          }
        } catch (error) {
          console.error("카카오 로그인 실패:", error.response?.data || error.message);
          setAlertMessage("카카오 로그인에 실패했습니다.");
        }
      },
      fail: (err) => {
        console.error("카카오 로그인 실패:", err);
        setAlertMessage("카카오 로그인에 실패했습니다.");
      },
    });
  };

  return (
    <div className="user-login-container">
      <h2 className="user-login-title">로그인</h2>
      <form className="user-login-form" onSubmit={handleLogin}>
        <div className="user-form-group">
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
        <div className="user-form-group">
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
        <button type="submit" className="user-login-button">
          로그인
        </button>
        <button
          type="button"
          className="user-register-button"
          onClick={() => navigate("/registerbutton")}
        >
          회원가입
        </button>
      </form>

      <div className="user-divider">
        <span className="user-divider-text">또는</span>
      </div>

      <div className="user-kakao-login-container">
        <img
          src={require("../../../assets/img/kakao_login_medium_wide.png")}
          alt="카카오 로그인"
          className="user-kakao-login-image"
          onClick={handleKakaoLogin}
        />
      </div>

      {alertMessage && (
        <AlertBox message={alertMessage} onClose={() => setAlertMessage("")} />
      )}
    </div>
  );
}
