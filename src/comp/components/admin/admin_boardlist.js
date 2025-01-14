import React, { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavBar";
import { fetchPosts, deletePost } from "../../api/admin";

const AdminBoardList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 5;

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
      alert("Failed to delete the post.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

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
    <div style={{ display: "flex" }}>
      <AdminNavbar />
      <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
        <h1>Admin Board List</h1>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by title or content"
            value={searchTerm}
            onChange={handleSearch}
            style={{ padding: "10px", width: "300px", marginRight: "10px" }}
          />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : (
          <>
            <table border="1" style={{ width: "100%", textAlign: "left" }}>
              <thead>
                <tr>
                  <th onClick={() => handleSort("board_idx")}>ID</th>
                  <th onClick={() => handleSort("title")}>Title</th>
                  <th>Content</th>
                  <th onClick={() => handleSort("like_count")}>Likes</th>
                  <th onClick={() => handleSort("view_count")}>Views</th>
                  <th onClick={() => handleSort("created_at")}>Created At</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                    <td>{post.is_deleted ? "Deleted" : "Active"}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(post.board_idx)}
                        style={{ color: "red" }}
                      >
                        Delete
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
                    backgroundColor: currentPage === page ? "#007BFF" : "#FFF",
                    color: currentPage === page ? "#FFF" : "#000",
                    border: "1px solid #007BFF",
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
