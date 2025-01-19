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
  const itemsPerPage = 5;

  useEffect(() => {
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

  // User statistics
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
      alert("Failed to toggle user status");
    }
  };

  const handleViewActivity = async (userId) => {
    try {
      const response = await fetchUserActivity(userId);
      setSelectedUserActivity(response.data);
      setIsModalOpen(true);
    } catch (err) {
      alert("Failed to fetch user activity.");
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
              <th>Name</th>
              <th>Nickname</th>
              <th>Email</th>
              <th>Social Type</th>
              <th>Active</th>
              <th>Actions</th>
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
                    {user.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleViewActivity(user.user_idx)}
                    style={{ marginLeft: "10px" }}
                  >
                    View Activity
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
                backgroundColor: currentPage === page ? "#007BFF" : "#FFF",
                color: currentPage === page ? "#FFF" : "#000",
                border: "1px solid #007BFF",
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
    <div style={{ display: "flex" }}>
      <AdminNavbar />
      <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
        <h1>Admin Dashboard</h1>

        {/* User Statistics Section */}
        <div
          className="statistics"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: "20px", margin: "0" }}>
              <strong>{totalUsers}</strong>
            </p>
            <span>Total Users</span>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: "20px", margin: "0" }}>
              <strong>{activeUsers}</strong>
            </p>
            <span>Active Users</span>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: "20px", margin: "0" }}>
              <strong>{inactiveUsers}</strong>
            </p>
            <span>Inactive Users</span>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: "20px", margin: "0" }}>
              <strong>{kakaoUsersCount}</strong>
            </p>
            <span>Kakao Users</span>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: "20px", margin: "0" }}>
              <strong>{generalUsersCount}</strong>
            </p>
            <span>General Users</span>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginRight: "10px", padding: "10px", width: "300px" }}
          />
          <select
            value={activeFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            style={{ padding: "10px" }}
          >
            <option value="ALL">All Users</option>
            <option value="ACTIVE">Active Users</option>
            <option value="INACTIVE">Inactive Users</option>
          </select>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : (
          <>
            <h2>Kakao Users</h2>
            {renderTable(kakaoUsers, currentKakaoPage, setCurrentKakaoPage)}
            <h2>General Users</h2>
            {renderTable(generalUsers, currentGeneralPage, setCurrentGeneralPage)}
          </>
        )}
        {/* Activity Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="User Activity"
          overlayClassName="ReactModal__Overlay"
          className="ReactModal__Content"
        >
          <h2>User Activity</h2>
          <button onClick={() => setIsModalOpen(false)} style={{ float: "right" }}>
            Close
          </button>
          <div style={{ marginTop: "20px" }}>
            {selectedUserActivity ? (
              <>
                <h3>Posts:</h3>
                <ul>
                  {selectedUserActivity.posts.map((post) => (
                    <li key={post.board_idx}>
                      {post.title} (Created At: {new Date(post.created_at).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
                <h3>Comments:</h3>
                <ul>
                  {selectedUserActivity.comments.map((comment) => (
                    <li key={comment.comment_idx}>
                      {comment.content} (On Post ID: {comment.board_idx})
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>No activity found.</p>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
