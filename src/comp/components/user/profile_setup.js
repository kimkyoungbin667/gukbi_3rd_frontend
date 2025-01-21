import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, uploadProfileImage, checkNicknameAvailability } from "../../api/user"; // 사용자 API 호출
import "../../css/user/profile-setup.css";

export default function ProfileSetup() {
  const [nickname, setNickname] = useState(""); // 닉네임 상태
  const [profileUrl, setProfileUrl] = useState(
    "https://i.pinimg.com/736x/df/e3/bf/dfe3bfb04d99e860dbdefaa1a5cb3c71.jpg"
  ); // 기본 이미지 URL
  const [isValidNickname, setIsValidNickname] = useState(true); // 닉네임 유효성 상태
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true); // 닉네임 중복 확인 상태
  const [isValidImage, setIsValidImage] = useState(true); // 이미지 유효성 상태
  const [message, setMessage] = useState(""); // 성공/오류 메시지 상태
  const navigate = useNavigate();

  const defaultImageUrl = "https://i.pinimg.com/736x/df/e3/bf/dfe3bfb04d99e860dbdefaa1a5cb3c71.jpg"; // 기본 이미지 URL

  // 닉네임 유효성 검사 함수
  const validateNickname = (nickname) => {
    const nicknameRegex = /^[\uAC00-\uD7A3a-zA-Z0-9]{2,12}$/; // 한글, 영문, 숫자만 허용, 6~12자
    const invalidPattern = /^[ㄱ-ㅎㅏ-ㅣ]+$/; // 자음/모음 단독 허용하지 않음
    return nicknameRegex.test(nickname) && !invalidPattern.test(nickname);
  };

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);
    setIsValidNickname(validateNickname(value));
    setIsNicknameAvailable(true); // 닉네임 변경 시 중복 확인 초기화
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!validateNickname(nickname)) {
      setMessage("닉네임이 유효하지 않습니다. 6~12자 한글, 영문, 숫자만 허용됩니다.");
      setIsValidNickname(false);
      return;
    }

    try {
      const isAvailable = await checkNicknameAvailability(nickname);
      setIsNicknameAvailable(isAvailable);

      if (!isAvailable) {
        setMessage("이미 사용 중인 닉네임입니다.");
        return;
      }

      await updateUserProfile({ nickname, profileUrl });
      setMessage("프로필이 성공적으로 업데이트되었습니다!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("프로필 업데이트 실패:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "프로필 업데이트에 실패했습니다.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!file.type.startsWith("image/") || !validExtensions.includes(fileExtension)) {
      setIsValidImage(false);
      setMessage("유효하지 않은 이미지 형식입니다.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadProfileImage(formData);
      setProfileUrl(`http://localhost:8080/${response.data.url}`);
      setIsValidImage(true);
    } catch (error) {
      console.error("파일 업로드 실패:", error.response?.data || error.message);
      setIsValidImage(false);
      setMessage("이미지 업로드에 실패했습니다.");
    }
  };

  const handleImageReset = () => {
    setProfileUrl(defaultImageUrl); // 기본 이미지로 초기화
    setIsValidImage(true); // 이미지 유효 상태 초기화
    setMessage("이미지가 기본 이미지로 재설정되었습니다.");
  };

  return (
    <div className="profile-setup-container">
      <h2 className="profile-setup-title">프로필 설정</h2>
      <form className="profile-setup-form" onSubmit={handleProfileUpdate}>
        <div className="form-group">
          <div className="image-upload-container">
            <div className="image-preview">
              <img src={profileUrl} alt="프로필 미리보기" className="preview-image" />
            </div>
            <label htmlFor="profileImage" className="custom-upload-button">
              이미지 선택
            </label>
            <button type="button" onClick={handleImageReset} className="default-image-button">
              이미지 취소
            </button>
            <input
              type="file"
              id="profileImage"
              className="form-input-hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>
          {!isValidImage && <p className="error-text">유효하지 않은 이미지입니다.</p>}
        </div>
        <div className="form-group">
          <label htmlFor="nickname" className="form-label">닉네임</label>
          <input
            type="text"
            id="nickname"
            className={`form-input ${isValidNickname && isNicknameAvailable ? "" : "invalid-input"}`}
            placeholder="닉네임 입력 (2~12자 한글, 영문, 숫자)"
            value={nickname}
            onChange={handleNicknameChange}
            required
          />
          {!isValidNickname && (
            <p className="error-text">닉네임은 2~12자의 한글, 영문, 숫자만 허용됩니다.</p>
          )}
          {!isNicknameAvailable && <p className="error-text">이미 사용 중인 닉네임입니다.</p>}
        </div>
        <button type="submit" className="profile-setup-button">
          저장하기
        </button>
      </form>
      {message && <p className={`message ${isValidImage ? "success-text" : "error-text"}`}>{message}</p>}
    </div>
  );
}
