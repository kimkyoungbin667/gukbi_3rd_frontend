import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, uploadProfileImage, checkNicknameAvailability } from "../../api/user"; // 사용자 API 호출
import "../../css/user/profile-setup.css";

export default function ProfileSetup() {
  const [nickname, setNickname] = useState(""); // 닉네임 상태
  const [profileUrl, setProfileUrl] = useState(""); // 프로필 URL 상태
  const [isValidNickname, setIsValidNickname] = useState(true); // 닉네임 유효성 상태
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true); // 닉네임 중복 확인 상태
  const [isValidImage, setIsValidImage] = useState(true); // 이미지 유효성 상태
  const [message, setMessage] = useState(""); // 성공/오류 메시지 상태
  const navigate = useNavigate();

  // 닉네임 유효성 검사 함수
  const validateNickname = (nickname) => {
    const nicknameRegex = /^[\uAC00-\uD7A3a-zA-Z0-9]{2,12}$/; // 한글, 영문, 숫자만 허용, 2~12자
    return nicknameRegex.test(nickname);
  };

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);
    setIsValidNickname(validateNickname(value));
    setIsNicknameAvailable(true); // 닉네임 변경 시 중복 확인 초기화
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // 닉네임 유효성 검사
    if (!validateNickname(nickname)) {
      setMessage("닉네임이 유효하지 않습니다. 2~12자 한글, 영문, 숫자만 허용됩니다.");
      setIsValidNickname(false);
      return;
    }

    // 닉네임 중복 검사
    try {
      const isAvailable = await checkNicknameAvailability(nickname);
      setIsNicknameAvailable(isAvailable);

      if (!isAvailable) {
        setMessage("이미 사용 중인 닉네임입니다.");
        return;
      }
    } catch (error) {
      console.error("닉네임 중복 확인 실패:", error.response?.data || error.message);
      setMessage("닉네임 중복 확인에 실패했습니다.");
      return;
    }

    // 프로필 업데이트 요청
    try {
      await updateUserProfile({ nickname, profileUrl }); // 프로필 업데이트 API 호출
      setMessage("프로필이 성공적으로 업데이트되었습니다!");
      setTimeout(() => navigate("/"), 2000); // 성공 메시지 후 이동
    } catch (error) {
      console.error("프로필 업데이트 실패:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "프로필 업데이트에 실패했습니다.");
    }
  };

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
      setMessage("유효하지 않은 이미지 형식입니다.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadProfileImage(formData);
      console.log("서버 응답:", response.data);
      setProfileUrl(`http://localhost:8080/${response.data.url}`); // 서버 URL 앞에 호스트 추가
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
          <label htmlFor="nickname" className="form-label">닉네임</label>
          <input
            type="text"
            id="nickname"
            className={`form-input ${isValidNickname && isNicknameAvailable ? "" : "invalid-input"
              }`}
            placeholder="닉네임 입력 (2~12자 한글, 영문, 숫자)"
            value={nickname}
            onChange={handleNicknameChange}
            required
          />
          {!isValidNickname && (
            <p className="error-text">닉네임은 2~12자의 한글, 영문, 숫자만 허용됩니다.</p>
          )}
          {!isNicknameAvailable && (
            <p className="error-text">이미 사용 중인 닉네임입니다.</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="profileImage" className="form-label">프로필 이미지 업로드</label>
          <div className="custom-file-upload">
            <label htmlFor="profileImage" className="custom-upload-button">
              파일 선택
            </label>
            <input
              type="file"
              id="profileImage"
              className="form-input-hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>
          {!isValidImage && (
            <p className="error-text">유효하지 않은 이미지입니다.</p>
          )}
        </div>

        {profileUrl && isValidImage && (
          <div className="image-preview">
            <img src={profileUrl} alt="프로필 미리보기" className="preview-image" />
          </div>
        )}
        <button type="submit" className="profile-setup-button">
          저장하기
        </button>
      </form>
      {message && <p className={`message ${isValidImage ? "success-text" : "error-text"}`}>{message}</p>}
    </div>
  );
}
