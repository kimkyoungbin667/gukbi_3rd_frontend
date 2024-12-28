import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { boardDetail } from "../../api/board";
import '../../css/board/boardDetail.css';

function BoardDetail() {
  const location = useLocation();
  const { state } = location;

  const [boardIdx, setBoardIdx] = useState(null);

  const [boardContents, setBoardContents] = useState({
    boardIdx: '',
    content: '',
    createdByUserIdx: '',
    createdByUserNickname: '',
    likeCount: 0,
    title: '',
    viewCount: 0,
  });

  const loggedInUserIdx = localStorage.getItem("userIdx");

  useEffect(() => {

    localStorage.setItem("userIdx", 2);
    if (state?.boardIdx) {
      setBoardIdx(state.boardIdx);
    }
  }, [state]);

  useEffect(() => {
    if (boardIdx !== null) {
      boardDetail({ boardIdx })
        .then((res) => {
          console.log(res);
          if (res.data) {
            setBoardContents(res.data.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [boardIdx]);

  // 수정 버튼 클릭 이벤트
  const handleEdit = () => {

  };

  // 삭제 버튼 클릭 이벤트
  const handleDelete = () => {
    
  };

  return (
    <div className="board-detail-container">
      <h1 className="board-detail-title">{boardContents.title}</h1>
      <div className="board-detail-content">{boardContents.content}</div>
      <div className="board-detail-info">
        <div>
          <span>작성자:</span> <span>{boardContents.createdByUserNickname}</span>
        </div>
        <div>
          <span>작성일:</span>{" "}
          <span>{new Date(boardContents.createdAt).toLocaleString()}</span>
        </div>
        <div>
          <span>조회수:</span> <span>{boardContents.viewCount}</span>
        </div>
        <div>
          <span>추천수:</span> <span>{boardContents.likeCount}</span>
        </div>
      </div>

      {loggedInUserIdx === String(boardContents.createdByUserIdx) && (
        <div className="board-detail-actions">
          <button className="edit-button" onClick={handleEdit}>
            수정
          </button>
          <button className="delete-button" onClick={handleDelete}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
}

export default BoardDetail;
