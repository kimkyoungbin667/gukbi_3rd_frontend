import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { BoardWriteAction } from "../../api/board";
import "../../css/board/boardWrite.css";

function BoardWrite() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const boardData = {
      title: title,
      content: content,
    };

    BoardWriteAction(boardData)
      .then((res) => {
        if (res.data.code === "200") {
          alert("게시글이 성공적으로 작성되었습니다.");
          navigate("/boardList");
        } else {
          alert("게시글 작성에 실패했습니다. 다시 시도해주세요.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("오류가 발생했습니다. 다시 시도해주세요.");
      });
  };

  return (
    <>
      <div className="board-edit-container">
        <h1 className="board-edit-title">✍ 게시글 작성</h1>

        {/* 제목 입력 */}
        <div className="board-edit-input">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            placeholder="제목을 입력하세요"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 내용 입력 */}
        <div className="board-edit-input">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            placeholder="내용을 입력하세요"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      {/* 작성 완료 버튼 */}
      <div className="board-edit-actions">
        <button className="edit-button" onClick={handleSubmit}>
          작성 완료
        </button>
      </div>
    </>
  );
}

export default BoardWrite;
