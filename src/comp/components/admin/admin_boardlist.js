import React, { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavBar";
import { fetchPosts, deletePost } from "../../api/admin";
import "../../css/admin/AdminBoardList.css";

const AdminBoardList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 10;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts();
        setPosts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post.board_idx !== postId));
    } catch (err) {
      alert("게시물을 삭제하는 데 실패했습니다.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1); // 검색 시 페이지는 1로 초기화
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // 게시물 통계 계산
  const totalPosts = posts.length;
  const totalLikes = posts.reduce((sum, post) => sum + post.like_count, 0);
  const totalViews = posts.reduce((sum, post) => sum + post.view_count, 0);
  const deletedPosts = posts.filter((post) => post.is_deleted).length;
  const activePosts = totalPosts - deletedPosts;

  const filteredPosts = posts
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;

  const currentPosts = filteredPosts.slice(startIdx, endIdx);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  return (
    <div className="admin-board-list-container" style={{ display: "flex" }}>
      <AdminNavbar />
      <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
        <h1>관리자 게시판 목록</h1>

        {/* 게시물 통계 섹션 */}
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
              <strong>{totalPosts}</strong>
            </p>
            <span>전체 게시물</span>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: "20px", margin: "0" }}>
              <strong>{activePosts}</strong>
            </p>
            <span>활성 게시물</span>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: "20px", margin: "0" }}>
              <strong>{deletedPosts}</strong>
            </p>
            <span>삭제된 게시물</span>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: "20px", margin: "0" }}>
              <strong>{totalLikes}</strong>
            </p>
            <span>총 좋아요</span>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: "20px", margin: "0" }}>
              <strong>{totalViews}</strong>
            </p>
            <span>총 조회수</span>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="제목 또는 내용을 검색"
            value={searchTerm}
            onChange={handleSearch}
            style={{ padding: "10px", width: "300px", marginRight: "10px" }}
          />
        </div>
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p style={{ color: "red" }}>오류: {error}</p>
        ) : (
          <>
            <table border="1" style={{ width: "100%", textAlign: "left" }}>
              <thead>
                <tr>
                  <th onClick={() => handleSort("board_idx")}>ID</th>
                  <th onClick={() => handleSort("title")}>제목</th>
                  <th>내용</th>
                  <th onClick={() => handleSort("like_count")}>좋아요</th>
                  <th onClick={() => handleSort("view_count")}>조회수</th>
                  <th onClick={() => handleSort("created_at")}>작성일</th>
                  <th>작성자</th>
                  <th>상태</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((post) => (
                  <tr key={post.board_idx}>
                    <td>{post.board_idx}</td>
                    <td>{post.title}</td>
                    <td>{post.content}</td>
                    <td>{post.like_count}</td>
                    <td>{post.view_count}</td>
                    <td>{new Date(post.created_at).toLocaleDateString()}</td>
                    <td>
                      {post.author_name} <br />
                      ({post.author_email})
                    </td>
                    <td>{post.is_deleted ? "삭제됨" : "활성"}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(post.board_idx)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    margin: "0 5px",
                    padding: "5px 10px",
                    backgroundColor: currentPage === page ? "#ffa726" : "#FFF",
                    color: currentPage === page ? "#FFF" : "#000",
                    border: "1px solid #ffa726",
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBoardList;
