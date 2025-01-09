import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import CommentArea from "../board/CommentArea.js";
import { jwtDecode } from "jwt-decode";
import { getBoardDetail, increaseView, boardDelete, upBoardPostLike } from "../../api/board";
import '../../css/board/boardDetail.css';

function BoardDetail() {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [boardIdx, setBoardIdx] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  // 토큰에서 userIdx 추출
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
    isLiked: '',
    title: '',
    viewCount: 0,
    imageFiles: []
  });

  useEffect(() => {

    if (state?.boardIdx) {
      setBoardIdx(state.boardIdx);
    }
  }, [state]);

  useEffect(() => {
    setIsLiked(boardContents.isLiked);
    console.log('dwdwdw', boardContents);
  }, [boardContents.isLiked]);

  useEffect(() => {

    // 게시글 상세 갖고오기
    if (boardIdx !== null) {
      getBoardDetail({ boardIdx })
        .then(res => {
          if (res.data.code == '200') {

            console.log(res.data);
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

      boardDelete({ boardIdx })
        .then(res => {
          navigate("/boardList");
        })
        .catch(err => {
          console.log(err);
        })
    }
  };

  // 목록으로 버튼 클릭 이벤트
  const handleGoToList = () => {
    navigate("/boardList");
  }

  // 좋아요 상태 값 변경
  const toggleLike = () => {

    if (!isLiked) {
      setBoardContents(prev => ({
        ...prev,
        likeCount: prev.likeCount + 1,
      }));
      setIsLiked(!isLiked);

      // 좋아요 눌렀을 때
    } else {
      setBoardContents(prev => ({
        ...prev,
        likeCount: prev.likeCount - 1,
      }));
      setIsLiked(!isLiked);
    }

    const upData = {
      boardIdx: boardContents.boardIdx
    }

    // 좋아요 +1 하기
    upBoardPostLike(upData)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  };

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
        
        <div className="upload-images">
            {boardContents.imageFiles && boardContents.imageFiles.map((image, index) => (
              <div key={index} className="upload-image">
                <img src={`http://localhost:8080/${boardContents.imageFiles[index]}`}
                 alt={`이미지 ${image}`} style={{ width: "200px" }} />
              </div>
            ))}
          </div>
      </div>

      {Number(userIdx) === Number(boardContents.createdByUserIdx) && (
        <div className="board-detail-actions">
          <button className="edit-button" onClick={handleEdit}>
            수정
          </button>
          <button className="delete-button" onClick={handleDelete}>
            삭제
          </button>
        </div>
      )}

      <div className="board-like-area">
        <button
          className={isLiked ? "liked-button" : "default-like-button"}
          onClick={toggleLike}
        > 👍
          {isLiked ? "Liked" : "Like"}
        </button>
      </div>


      <div>
        <button className="goToboardList-btn" onClick={handleGoToList}>
          목록으로
        </button>
      </div>
      <hr />

      {boardIdx && <CommentArea boardIdx={boardIdx} />}

      <hr />
    </>
  );
}

export default BoardDetail;
