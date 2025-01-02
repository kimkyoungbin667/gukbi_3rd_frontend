import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import CommentArea from "../board/CommentArea.js";
import { getBoardDetail, increaseView, boardDelete } from "../../api/board";
import '../../css/board/boardDetail.css';

function BoardDetail() {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [boardIdx, setBoardIdx] = useState(null);

  // 게시글 정보
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

    // 유저인덱스 임시 설정
    localStorage.setItem("userIdx", 3);

    if (state?.boardIdx) {
      setBoardIdx(state.boardIdx);
    }

  }, [state]);

  useEffect(() => {

    // 게시글 상세 갖고오기
    if (boardIdx !== null) {
      getBoardDetail({ boardIdx })
        .then(res => {
          if (res.data.code == '200') {
            setBoardContents(res.data.data);
          }
        })
        .catch(err => {
          console.error(err);
        });
    }

    if (boardIdx !== null) {

      // 조회수 올리기 
      increaseView({ boardIdx })
        .then(res => {
          if (res.data.code === "201") {
          } else {
            setBoardContents(prev => ({
              ...prev,
              viewCount: prev.viewCount + 1,
            }));
          }
        })
    }
  }, [boardIdx]);

  // 수정 버튼 클릭 이벤트
  const handleEdit = () => {
    navigate("/boardEdit", { state: { boardIdx: boardIdx } })
  };

  // 삭제 버튼 클릭 이벤트
  const handleDelete = () => {

    if (window.confirm("삭제하시겠습니까?")) {
      let obj = new Object();
      obj.boardIdx = boardIdx;
      boardDelete(obj)
        .then(res => {
          navigate("/boardList");
        })
        .catch(err => {
          console.log(err);
        })
    }
  };

  const handleGoToList = () => {
    navigate("/boardList");
  }

  return (
    <>
      <div className="board-detail-container">
        <h1 className="board-detail-title">{boardContents.title}</h1>
        <div className="board-detail-content">{boardContents.content}</div>
        <div className="board-detail-info">
          <div>
            <span>작성자:</span> <span>{boardContents.createdByUserNickname}</span>
          </div>
          <div>
            <span>작성일:</span>
            <span>{new Date(boardContents.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <span>조회수:</span> <span>{boardContents.viewCount}</span>
          </div>
          <div>
            <span>추천수:</span> <span>{boardContents.likeCount}</span>
          </div>
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
      <hr />

      {boardIdx && <CommentArea boardIdx={boardIdx} />}

      <hr />
      <div>
        <button className="goToboardList-btn" onClick={handleGoToList}>
          목록으로
        </button>
      </div>
    </>
  );
}

export default BoardDetail;
