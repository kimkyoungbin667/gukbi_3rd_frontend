import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, uploadProfileImage } from "../../api/user";

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
        console.log("사용자 정보:", response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 실패:", error.message);
      });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedUser(user); // 현재 정보를 수정 가능한 상태로 복사
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
      setSelectedImage(`http://localhost:8080${response.data.url}`); // 전체 URL 설정
      setIsValidImage(true);
    } catch (error) {
      console.error("파일 업로드 실패:", error.response?.data || error.message);
      setIsValidImage(false);
      setMessage("이미지 업로드에 실패했습니다.");
    }
  };

  const handleSaveClick = () => {
    const formData = new FormData();

    formData.append("nickname", editedUser.userNickname || user.userNickname);
    if (selectedImage) {
      formData.append("profileUrl", selectedImage); // 전체 URL 저장
    }

    updateUserProfile(formData)
      .then(() => {
        console.log("프로필 업데이트 성공!");
        setIsEditing(false);
        setSelectedImage(null); // 선택된 이미지 초기화
        setMessage("프로필이 성공적으로 업데이트되었습니다!");
        fetchUserProfile(); // 최신 데이터 다시 가져오기
      })
      .catch((error) => {
        console.error("프로필 업데이트 실패:", error.message);
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

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      {isEditing ? (
        <div>
          <div>
            <label>
              닉네임:{" "}
              <input
                type="text"
                name="userNickname"
                value={editedUser.userNickname || ""}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              프로필 이미지 업로드:{" "}
              <input type="file" accept="image/*" onChange={handleFileUpload} />
            </label>
            {!isValidImage && <p className="error-text">유효하지 않은 이미지입니다.</p>}
            {selectedImage && isValidImage && (
              <div>
                <img
                  src={selectedImage} // 전체 URL 사용
                  alt="프로필 미리보기"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginTop: "10px",
                  }}
                />
              </div>
            )}
          </div>
          <button onClick={handleSaveClick}>저장</button>
          <button onClick={handleCancelClick}>취소</button>
          {message && <p className="message">{message}</p>}
        </div>
      ) : (
        <div>
          <div>
            <img
              src={user.userProfileUrl}
              alt={`${user.userName}님의 프로필`}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <h1>환영합니다, {user.userName}님!</h1>
          <p>이메일: {user.userEmail}</p>
          <p>닉네임: {user.userNickname}</p>
          <p>생년월일: {user.userBirth}</p>
          <p>소셜 타입: {user.socialType}</p>
          <button onClick={handleEditClick}>수정</button>
        </div>
      )}
    </div>
  );
}
