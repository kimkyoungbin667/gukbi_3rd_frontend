import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getBoardDetail, saveEditBoard } from "../../api/board";
import '../../css/board/boardEdit.css';

function BoardEdit() {
  const location = useLocation();
  const { state } = location;

  const [boardIdx, setBoardIdx] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userIdx = decodedToken.sub;

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


  useEffect(() => {

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

  }, [boardIdx]);

  // 수정 버튼 클릭 이벤트
  const finishEdit = () => {

    const editData = {
      boardIdx: boardIdx,
      content: boardContents.content
    };

    saveEditBoard(editData)
      .then(res => {
        if (res.data.code === '200') {
          navigate("/boardList")
        }
      })
  };

  const cancleEdit = () => {
    navigate("/boardList");
  }

  return (
    <>
      <div className="board-edit-container">
        <h1 className="board-edit-title">{boardContents.title}</h1>
        <div className="board-edit-content">
          <textarea
            value={boardContents.content}
            onChange={(e) =>
              setBoardContents({
                ...boardContents,
                content: e.target.value,
              })
            }
          />
        </div>
        <div className="board-edit-info">
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

      <div className="board-edit-actions">
        <button className="edit-button" onClick={finishEdit}>
          수정 완료
        </button>
        <button className="cancle-button" onClick={cancleEdit}>
          취소
        </button>
      </div>
    </>
  );
}

export default BoardEdit;
