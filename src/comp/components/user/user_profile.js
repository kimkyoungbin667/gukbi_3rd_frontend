import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, uploadProfileImage } from "../../api/user";
import "../../css/user/profile.css"; // 고유화된 CSS 파일

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isValidImage, setIsValidImage] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = () => {
    getUserProfile()
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 실패:", error.message);
      });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedUser(user);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
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
      setSelectedImage(`http://localhost:8080${response.data.url}`);
      setIsValidImage(true);
    } catch (error) {
      setIsValidImage(false);
      setMessage("이미지 업로드에 실패했습니다.");
    }
  };

  const handleSaveClick = () => {
    const formData = {
      nickname: editedUser.userNickname || user.userNickname,
      profileUrl: selectedImage || user.userProfileUrl,
    };

    updateUserProfile(formData)
      .then(() => {
        setIsEditing(false);
        setSelectedImage(null);
        setMessage("프로필이 성공적으로 업데이트되었습니다!");
        fetchUserProfile();
      })
      .catch((error) => {
        setMessage("프로필 업데이트에 실패했습니다.");
      });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedUser(null);
    setSelectedImage(null);
    setIsValidImage(true);
    setMessage("");
  };

  if (!user) return <div className="user-profile-loading">Loading...</div>;

  return (
    <div className="user-profile-page-container">
      {isEditing ? (
        <div className="user-profile-edit-section">
          <h2>프로필 수정</h2>
          <div className="user-form-group">
            <label>닉네임</label>
            <input
              type="text"
              name="userNickname"
              value={editedUser.userNickname || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="user-form-group">
            <label>프로필 이미지 업로드</label>
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            {selectedImage && (
              <img
                src={selectedImage}
                alt="프로필 미리보기"
                className="user-profile-preview"
              />
            )}
          </div>
          {!isValidImage && <p className="user-error-text">유효하지 않은 이미지입니다.</p>}
          <div className="user-button-group">
            <button onClick={handleSaveClick} className="user-save-button">저장</button>
            <button onClick={handleCancelClick} className="user-cancel-button">취소</button>
          </div>
          {message && <p className="user-message">{message}</p>}
        </div>
      ) : (
        <div className="user-profile-view-section">
          <img
            src={user.userProfileUrl}
            alt={`${user.userName}님의 프로필`}
            className="user-profile-image"
          />
          <h1>{user.userName}님</h1>
          <p>이메일: {user.userEmail}</p>
          <p>닉네임: {user.userNickname}</p>
          <p>생년월일: {user.userBirth}</p>
          <p>소셜 타입: {user.socialType}</p>
          <button onClick={handleEditClick} className="user-edit-button">수정</button>
        </div>
      )}
    </div>
  );
}
