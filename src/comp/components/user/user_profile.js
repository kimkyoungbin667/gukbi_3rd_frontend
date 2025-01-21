import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile, uploadProfileImage, changePassword, deactivateUser, logoutUser, getUserPosts } from "../../api/user"; // API 호출
import "../../css/user/profile.css"; // 고유화된 CSS 파일
import { useNavigate } from "react-router-dom";
import AlertBox from "../general/alertbox"; // AlertBox 컴포넌트 import

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태
  const [editedUser, setEditedUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isValidImage, setIsValidImage] = useState(true);
  const [message, setMessage] = useState(""); // 알림 메시지 상태
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [posts, setPosts] = useState([]); // 게시글 목록 상태 추가

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserPosts();  // 사용자의 게시글을 불러옵니다.
    }
  }, [user]);

  const fetchUserProfile = () => {
    getUserProfile()
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 실패:", error.message);
      });
  };

  const fetchUserPosts = () => {
    getUserPosts(user.userIdx)  // user.userId를 통해 사용자가 작성한 글을 불러옵니다
      .then((response) => {
        setPosts(response.data); // 게시판 글 상태에 저장
      })
      .catch((error) => {
        console.error("게시판 글 가져오기 실패:", error.message);
      });
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
      setSelectedImage(`http://58.74.46.219:33334${response.data.url}`);
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
        setMessage("프로필이 성공적으로 업데이트되었습니다!");
        fetchUserProfile();
        setIsModalOpen(false); // 수정 완료 후 모달 닫기
      })
      .catch((error) => {
        setMessage("프로필 업데이트에 실패했습니다.");
      });
  };

  const handlePasswordChange = async () => {
    try {
      await changePassword({ currentPassword, newPassword });
      setMessage("비밀번호가 성공적으로 변경되었습니다.");
    } catch (error) {
      setMessage("비밀번호 변경에 실패했습니다.");
    }
  };

  const handleDeactivation = async () => {
    if (!window.confirm("정말로 회원 탈퇴를 진행하시겠습니까?")) return;

    try {
      await deactivateUser();
      setMessage("회원 탈퇴가 성공적으로 처리되었습니다.");
      await logoutUser();
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setTimeout(() => {
        window.location.href = "/"; // 메인 페이지로 이동
      }, 2000);
    } catch (error) {
      setMessage("회원 탈퇴에 실패했습니다.");
    }
  };

  const handleCloseMessage = () => {
    setMessage(""); // 메시지 닫기
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-profile-page-container">
      {/* 프로필 정보 구역 */}
      <div className="user-profile-info-container">
        <div className="user-profile-left">
          <img src={`http://58.74.46.219:33334${user.userProfileUrl}`} alt="프로필" className="user-profile-image" />
          
        </div>
        <div className="user-profile-right">
          <h1>{user.userName}님</h1>
          <p>이메일: {user.userEmail}</p>
          <p>닉네임: {user.userNickname}</p>
          <p>생년월일: {user.userBirth}</p>
          <p>소셜 타입: {user.socialType}</p>
          {/* 수정 버튼 클릭 시 모달 열기 */}
          <button onClick={() => setIsModalOpen(true)} className="user-edit-button">수정</button>
        </div>
      </div>

      {/* 프로필 수정 모달 */}
      {isModalOpen && (
        <div className="user-profile-modal">
          <div className="modal-content">
            <h2>프로필 수정</h2>
            <div className="user-form-group">
              <label>닉네임</label>
              <input
                type="text"
                name="userNickname"
                value={editedUser ? editedUser.userNickname : user.userNickname}
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
              <button onClick={() => setIsModalOpen(false)} className="user-cancel-button">취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 비밀번호 변경 구역 */}
      <div className="password-change-section">
        <h2>비밀번호 변경</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>현재 비밀번호</label>
            <input
              type="password"
              placeholder="현재 비밀번호 입력"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>새 비밀번호</label>
            <input
              type="password"
              placeholder="새 비밀번호 입력"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button type="button" onClick={handlePasswordChange} className="password-change-button">
            비밀번호 변경
          </button>
        </form>
      </div>

      {/* 회원 탈퇴 구역 */}
      <div className="deactivate-account-section">
        <h2>회원 탈퇴</h2>
        <p>회원 탈퇴를 진행하면 계정이 비활성화됩니다.</p>
        <button onClick={handleDeactivation} className="deactivate-button">
          회원 탈퇴
        </button>
      </div>

      {/* 내가 한 활동 섹션 */}
      <div className="user-activities-section">
        <h2>내가 한 활동</h2>
        <div className="activity-list">
          {posts.length === 0 ? (
            <p>작성한 게시글이 없습니다.</p>
          ) : (
            posts.map((post, index) => (
              <div
                key={index}
                className="activity-item"
                onClick={() => navigate(`/detail/${post.boardidx}`)}  // 게시글 클릭 시 상세 페이지로 이동
              >
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p className="activity-date">작성일: {new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 메시지 알림박스 */}
      {message && <AlertBox message={message} onClose={handleCloseMessage} />}
    </div>
  );
}
