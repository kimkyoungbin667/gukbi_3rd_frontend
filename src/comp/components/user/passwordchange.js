import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../api/user"; // 비밀번호 변경 API 호출

export default function PasswordChange() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // 새 비밀번호와 확인 비밀번호 일치 여부 확인
    if (newPassword !== confirmPassword) {
      setMessage("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 비밀번호 변경 API 호출
      await changePassword({ currentPassword, newPassword });
      setMessage("비밀번호가 성공적으로 변경되었습니다.");
      setTimeout(() => navigate("/"), 2000); // 메인 페이지로 이동
    } catch (error) {
      console.error("비밀번호 변경 실패:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message || "비밀번호 변경에 실패했습니다."
      );
    }
  };

  return (
    <div className="password-change-container">
      <h2>비밀번호 변경</h2>
      <form onSubmit={handlePasswordChange} className="password-change-form">
        <div className="form-group">
          <label htmlFor="currentPassword">현재 비밀번호</label>
          <input
            type="password"
            id="currentPassword"
            placeholder="현재 비밀번호 입력"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            type="password"
            id="newPassword"
            placeholder="새 비밀번호 입력"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">새 비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="password-change-button">
          비밀번호 변경
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
