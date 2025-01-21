import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import AdminNavbar from "./AdminNavBar";
import { fetchUsers, toggleUserStatus, fetchUserActivity } from "../../api/admin";
import "../../css/admin/AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentKakaoPage, setCurrentKakaoPage] = useState(1);
  const [currentGeneralPage, setCurrentGeneralPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedUserActivity, setSelectedUserActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    Modal.setAppElement("#root"); // Modal 세팅
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // 사용자 통계
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.is_active).length;
  const inactiveUsers = users.filter((user) => !user.is_active).length;
  const kakaoUsersCount = users.filter((user) => user.social_type === "KAKAO").length;
  const generalUsersCount = users.filter((user) => user.social_type === "GENERAL").length;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentKakaoPage(1);
    setCurrentGeneralPage(1);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentKakaoPage(1);
    setCurrentGeneralPage(1);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await toggleUserStatus(userId, !currentStatus);
      setUsers(users.map((user) => (user.user_idx === userId ? { ...user, is_active: !currentStatus } : user)));
    } catch (err) {
      alert("사용자 상태 변경에 실패했습니다.");
    }
  };

  const handleViewActivity = async (userId) => {
    try {
      const response = await fetchUserActivity(userId);
      setSelectedUserActivity(response.data);
      setIsModalOpen(true); // 모달 열기
    } catch (err) {
      alert("사용자 활동을 불러오는 데 실패했습니다.");
    }
  };

  const filteredUsers = users
    .filter((user) =>
      user.user_name?.toLowerCase().includes(searchTerm) ||
      user.user_email?.toLowerCase().includes(searchTerm)
    )
    .filter((user) => {
      if (activeFilter === "ACTIVE") return user.is_active;
      if (activeFilter === "INACTIVE") return !user.is_active;
      return true;
    });

  const kakaoUsers = filteredUsers.filter((user) => user.social_type === "KAKAO");
  const generalUsers = filteredUsers.filter((user) => user.social_type === "GENERAL");

  const paginate = (users, currentPage) => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return users.slice(startIdx, endIdx);
  };

  const renderTable = (users, currentPage, setPage) => {
    const paginatedUsers = paginate(users, currentPage);
    const totalPages = Math.ceil(users.length / itemsPerPage);

    return (
      <>
        <table border="1" style={{ width: "100%", textAlign: "left", marginBottom: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>닉네임</th>
              <th>이메일</th>
              <th>소셜 타입</th>
              <th>활성화 상태</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.user_idx}>
                <td>{user.user_idx}</td>
                <td>{user.user_name}</td>
                <td>{user.user_nickname || "N/A"}</td>
                <td>{user.user_email}</td>
                <td>{user.social_type || "N/A"}</td>
                <td>{user.is_active ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => handleToggleStatus(user.user_idx, user.is_active)}>
                    {user.is_active ? "비활성화" : "활성화"}
                  </button>
                  <button onClick={() => handleViewActivity(user.user_idx)} style={{ marginLeft: "10px" }}>
                    활동 보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setPage(page)}
              style={{
                margin: "0 5px",
                padding: "5px 10px",
                backgroundColor: currentPage === page ? "#ffa726" : "#FFF",
                color: currentPage === page ? "#FFF" : "#000",
                border: "1px solid #ffa726",
                cursor: "pointer",
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="admin-dashboard-container" style={{ display: "flex" }}>
      <AdminNavbar />
      <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
        <h1>관리자 대시보드</h1>

        {/* 사용자 통계 섹션 */}
        <div
          className="statistics"
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            width: "100%",  
          }}

        >
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: "20px", margin: "0" }}>
              <strong>{totalUsers}</strong>
            </p>
            <span>총 사용자</span>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: "20px", margin: "0" }}>
              <strong>{activeUsers}</strong>
            </p>
            <span>활성 사용자</span>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: "20px", margin: "0" }}>
              <strong>{inactiveUsers}</strong>
            </p>
            <span>비활성 사용자</span>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: "20px", margin: "0" }}>
              <strong>{kakaoUsersCount}</strong>
            </p>
            <span>카카오 사용자</span>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: "20px", margin: "0" }}>
              <strong>{generalUsersCount}</strong>
            </p>
            <span>일반 사용자</span>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="이름 또는 이메일로 검색"
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginRight: "10px", padding: "10px", width: "300px" }}
          />
          <select value={activeFilter} onChange={(e) => handleFilterChange(e.target.value)} style={{ padding: "10px" }}>
            <option value="ALL">전체 사용자</option>
            <option value="ACTIVE">활성 사용자</option>
            <option value="INACTIVE">비활성 사용자</option>
          </select>
        </div>

        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p style={{ color: "red" }}>오류: {error}</p>
        ) : (
          <>
            <h2>카카오 사용자</h2>
            {renderTable(kakaoUsers, currentKakaoPage, setCurrentKakaoPage)}
            <h2>일반 사용자</h2>
            {renderTable(generalUsers, currentGeneralPage, setCurrentGeneralPage)}
          </>
        )}
        {/* 활동 모달 */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="사용자 활동"
          overlayClassName="customModalOverlay"
          className="customModalContent"
        >
          <h2>사용자 활동</h2>
          <button onClick={() => setIsModalOpen(false)} className="customCloseButton">
            닫기
          </button>
          <div>
            {selectedUserActivity ? (
              <>
                <h3>게시글:</h3>
                <ul>
                  {selectedUserActivity.posts.map((post) => (
                    <li key={post.board_idx}>{post.title}</li>
                  ))}
                </ul>
                <h3>댓글:</h3>
                <ul>
                  {selectedUserActivity.comments.map((comment) => (
                    <li key={comment.comment_idx}>{comment.content}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p>활동이 없습니다.</p>
            )}
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default AdminDashboard;
