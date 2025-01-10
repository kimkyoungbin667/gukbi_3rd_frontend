import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { getBoardDetail, saveEditBoard } from "../../api/board";
import "../../css/board/boardEdit.css";

function BoardEdit() {
  const location = useLocation();
  const { state } = location;

  const [boardIdx, setBoardIdx] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userIdx = decodedToken.sub;

  const [boardContents, setBoardContents] = useState({
    boardIdx: "",
    content: "",
    createdByUserIdx: "",
    createdByUserNickname: "",
    likeCount: 0,
    title: "",
    viewCount: 0,
    imageFiles: [], // 기존 이미지 및 새로 추가된 이미지를 함께 관리
  });

  useEffect(() => {
    if (state?.boardIdx) {
      setBoardIdx(state.boardIdx);
    }
  }, [state]);

  useEffect(() => {

    console.log(boardIdx);
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

  }, [boardIdx]);

  const finishEdit = () => {
    const existingImages = boardContents.imageFiles.filter(
      (image) => typeof image === "string"
    );
    const newImages = boardContents.imageFiles
      .filter((image) => image.previewUrl)
      .map((image) => image.file);

    const formData = new FormData();

    const jsonData = {
      boardIdx: boardIdx,
      authorIdx: userIdx,
      content: boardContents.content,
      existingImages: existingImages,
    };
    formData.append("editData", JSON.stringify(jsonData));

    newImages.forEach((file) => {
      formData.append("newImages", file);
    });

    axios
      .post("http://localhost:8080/api/board/updateBoardPost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.code === "200") {
          navigate("/boardList");
        } else {
          console.error("Error:", res.data.message);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const cancelEdit = () => {
    navigate("/boardList");
  };

  const handleImageFile = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImageFiles = files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setBoardContents((prev) => ({
        ...prev,
        imageFiles: Array.isArray(prev.imageFiles)
          ? [...prev.imageFiles, ...newImageFiles]
          : [...newImageFiles],
      }));
    }
  };

  const excludeImage = (index) => {
    const removedImage = boardContents.imageFiles[index];
    if (removedImage?.previewUrl) {
      URL.revokeObjectURL(removedImage.previewUrl);
    }

    setBoardContents((prev) => ({
      ...prev,
      imageFiles: [
        ...prev.imageFiles.slice(0, index),
        ...prev.imageFiles.slice(index + 1),
      ],
    }));
  };

  return (
    <div className="board-edit-container">
      <h1 className="board-edit-title">{boardContents.title}</h1>
      <div className="board-edit-body">
        <textarea
          value={boardContents.content}
          onChange={(e) =>
            setBoardContents({
              ...boardContents,
              content: e.target.value,
            })
          }
        />
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

      <div className="file-upload">
        <label htmlFor="file-upload">🖼️ 이미지 업로드</label>
        <input
          type="file"
          multiple
          accept="image/*"
          id="file-upload"
          onChange={handleImageFile}
        />
      </div>

      {boardContents.imageFiles?.length > 0 && (
        <div className="board-edit-upload-images">
          {boardContents.imageFiles.map((image, index) => (
            <div key={index} className="board-edit-upload-image">
              <img
                src={
                  image.previewUrl
                    ? image.previewUrl
                    : `http://localhost:8080/${image}`
                }
                alt={`이미지 ${index + 1}`}
              />
              <button type="button" onClick={() => excludeImage(index)}>
                제거
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="board-edit-actions">
        <button className="board-edit-button" onClick={finishEdit}>
          수정 완료
        </button>
        <button className="board-cancel-button" onClick={cancelEdit}>
          취소
        </button>
      </div>
    </div>
  );
}

export default BoardEdit;