import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, uploadProfileImage } from "../../api/user"; // 사용자 API 호출

export default function ProfileSetup() {
  const [nickname, setNickname] = useState(""); // 닉네임 상태
  const [profileUrl, setProfileUrl] = useState(""); // 프로필 URL 상태
  const [isValidImage, setIsValidImage] = useState(true); // 이미지 유효성 상태
  const [message, setMessage] = useState(""); // 성공/오류 메시지 상태
  const navigate = useNavigate();

  // 프로필 업데이트 처리
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateUserProfile({ nickname, profileUrl }); // 프로필 업데이트 API 호출
      setMessage("프로필이 성공적으로 업데이트되었습니다!");
      setTimeout(() => navigate("/"), 2000); // 성공 메시지 후 이동
    } catch (error) {
      console.error("프로필 업데이트 실패:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message || "프로필 업데이트에 실패했습니다."
      );
    }
  };

  // 파일 업로드 처리
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    console.log("파일 이름:", file.name);
    console.log("파일 타입:", file.type);
    console.log("파일 크기:", file.size);
  
    const validExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
  
    if (!file.type.startsWith("image/") || !validExtensions.includes(fileExtension)) {
      console.log("유효하지 않은 이미지 형식");
      setIsValidImage(false);
      alert("유효하지 않은 이미지 형식입니다.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await uploadProfileImage(formData);
      console.log("서버 응답:", response.data);
      setProfileUrl(`http://localhost:8080${response.data.url}`); // 서버 URL 앞에 호스트 추가
      setIsValidImage(true);
    } catch (error) {
      console.error("파일 업로드 실패:", error.response?.data || error.message);
      setIsValidImage(false);
      setMessage("이미지 업로드에 실패했습니다.");
    }
  };

  return (
    <div className="profile-setup-container">
      <h2 className="profile-setup-title">프로필 설정</h2>
      <form className="profile-setup-form" onSubmit={handleProfileUpdate}>
        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            placeholder="닉네임 입력"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)} // 닉네임 수정
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="profileImage">프로필 이미지 업로드</label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleFileUpload} // 파일 업로드 처리
          />
          {!isValidImage && (
            <p className="error-text">유효하지 않은 이미지입니다.</p>
          )}
        </div>
        {profileUrl && isValidImage && (
          <div className="image-preview">
            <img src={profileUrl} alt="프로필 미리보기" />
          </div>
        )}
        <button type="submit" className="profile-setup-button">
          저장하기
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
