import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deactivateUser, logoutUser } from "../../api/user";
import { useAuth } from "../../../AuthContext"; // AuthContext 사용

export default function AccountDeactivation() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth(); // 로그인 상태 업데이트를 위한 함수 가져오기

  const handleDeactivation = async () => {
    if (!window.confirm("정말로 회원 탈퇴를 진행하시겠습니까?")) return;

    try {
      // 회원 탈퇴 처리
      await deactivateUser();
      setMessage("회원 탈퇴가 성공적으로 처리되었습니다.");

      // 로그아웃 처리
      await logoutUser();

      // 클라이언트 로그아웃 처리
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setIsLoggedIn(false); // AuthContext의 상태를 업데이트

      setTimeout(() => {
        navigate("/"); // 메인 페이지로 이동
      }, 2000);
    } catch (error) {
      console.error("회원 탈퇴 실패:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message || "회원 탈퇴에 실패했습니다."
      );
    }
  };

  return (
    <div className="account-deactivation-container">
      <h2>회원 탈퇴</h2>
      <p>회원 탈퇴를 진행하면 계정이 비활성화됩니다.</p>
      <button onClick={handleDeactivation} className="deactivate-button">
        회원 탈퇴
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
