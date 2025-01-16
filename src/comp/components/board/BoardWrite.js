import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLikeLocation, getMapByPath } from "../../api/board";

import "../../css/board/boardWrite.css";

function BoardWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const MAX_IMAGES = 12; // 최대 업로드 이미지 개수
  const token = localStorage.getItem("token");

  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);

  // 즐겨찾기 장소들
  const [likeLocation, setLikeLocation] = useState([]);

  // 산책 경로들
  const [myPath, setMyPath] = useState([]);


  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    imageFiles.forEach((item) => {
      formData.append("images", item.file); // 파일 객체만 추가
    });

    // 디버깅: FormData의 내용을 출력
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const res = await fetch("http://58.74.46.219:33334/api/board/createBoardPost", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        alert("게시글이 성공적으로 작성되었습니다.");
        navigate("/boardList");
      } else {
        alert(result.message || "게시글 업로드 실패");
      }
    } catch (error) {
      console.error("업로드 중 오류 발생:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 이미지 추가
  const handleImageFile = (e) => {
    const files = Array.from(e.target.files);

    if (imageFiles.length + files.length > MAX_IMAGES) {
      alert(`이미지는 최대 ${MAX_IMAGES}개까지만 업로드 가능합니다.`);
      return;
    }

    const newImageFiles = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file), // 미리보기 URL 생성
    }));
    setImageFiles((prev) => [...prev, ...newImageFiles]);
  };

  // 이미지 제거
  const handleRemoveImage = (index) => {
    const removedImage = imageFiles[index];
    if (removedImage?.previewUrl) {
      URL.revokeObjectURL(removedImage.previewUrl); // 미리보기 URL 해제
    }
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 공유 버튼에 대한 모달창 열기
  const openModal = (kind) => {

    if (kind === "location") {
      setIsLikeModalOpen(true);
      getLikeLocationAction("location");
    } else {
      setIsPathModalOpen(true);
      getLikeLocationAction("path");
    }
  };

  // 모달 닫기
  const closeModal = (kind) => {

    if (kind === "location") {
      setIsLikeModalOpen(false);
    } else {
      setIsPathModalOpen(false);
    }
  };

  // 산책경로 불러오기
  const getLikeLocationAction = (kind) => {

    getLikeLocation({ kind })
      .then(res => {
        console.log(res.data.data);
        if (res.data.code === "200") {

          // 줄겨찾기
          if (kind === "location") {
            setLikeLocation(res.data.data);
          }

          // 산책 경로
          else {
            setMyPath(res.data.data);
          }


        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  // 특정 산책경로 지도 불러오기
  const getMapByPathAction = (logId) => {

    getMapByPath({ lodId: logId })
      .then(res => {
        console.log(res);
      })

      .catch(err => {
        console.log(err);
      })
  }




  return (
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

      {/* 이미지 업로드 */}
      <div className="board-image-input">
        <div className="file-upload">

          <label htmlFor="file-upload">업로드 🖼️</label>
          <input
            type="file"
            multiple
            accept="image/*"
            id="file-upload"
            onChange={handleImageFile}
          />

          <input
            type="button"
            id="location-share"
            value="장소 공유 🗺️"
            onClick={(e) => openModal("location")}
          />

          <input
            type="button"
            id="path-share-btn"
            value="산책경로 공유 📌"
            onClick={() => openModal("path")}
          />
        </div>

        {/* 즐겨찾기한 경로 모달창 */}
        {isLikeModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>나의 즐겨찾기 장소 목록</h2>

              {/* 테이블 형식으로 변경 */}
              <table className="path-table">
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>산책로 이름</th>
                    <th>날짜</th>
                    <th>시작 시간</th>
                    <th>종료 시간</th>
                    <th>선택</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(likeLocation) && likeLocation.length > 0 ? (
                    likeLocation.map((loc, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{loc.walkName}</td>
                        <td>{loc.walkDate?.slice(0, 10)}</td>
                        <td>{loc.startTime?.slice(11, 16)}</td>
                        <td>{loc.endTime?.slice(11, 16)}</td>
                        <td>
                          <button className="select-button" onClick={() => getMapByPathAction(loc.logId)}>
                            선택
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">데이터가 없습니다.</td>
                    </tr>
                  )}
                </tbody>

              </table>

              <button onClick={() => closeModal("location")} className="close-modal-button">
                취소
              </button>

            </div>
          </div>
        )}

        {/* 산책 경로 모달창 */}
        {isPathModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>나의 산책경로 목록</h2>

              {/* 테이블 형식으로 변경 */}
              <table className="path-table">
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>산책로 이름</th>
                    <th>날짜</th>
                    <th>시작 시간</th>
                    <th>종료 시간</th>
                    <th>선택</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(myPath) && myPath.length > 0 ? (
                    myPath.map((path, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{path.walkName}</td>
                        <td>{path.walkDate?.slice(0, 10)}</td>
                        <td>{path.startTime?.slice(11, 16)}</td>
                        <td>{path.endTime?.slice(11, 16)}</td>
                        <td>
                          <button className="select-button" onClick={() => getMapByPathAction(path.logId)}>
                            선택
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">데이터가 없습니다.</td>
                    </tr>
                  )}
                </tbody>

              </table>

              <button onClick={() => closeModal("path")} className="close-modal-button">
                취소
              </button>

            </div>
          </div>
        )}

        {/* 이미지 업로드 제한 표시 */}
        {imageFiles.length > 0 && <p p className="image-limit">
          업로드된 이미지: {imageFiles.length}/{MAX_IMAGES}
        </p>}

        {/* 업로드한 이미지 미리보기 */}
        {imageFiles.length > 0 && <div className="board-edit-upload-images">
          {imageFiles.map((image, index) => (
            <div key={index} className="board-edit-upload-image">
              <img src={image.previewUrl} alt={`미리보기 ${index}`} />
              <button type="button" className="preview-btn" onClick={() => handleRemoveImage(index)}>
                제거
              </button>
            </div>
          ))}
        </div>}
      </div>

      {/* 작성 완료 버튼 */}
      <div className="board-edit-actions">
        <button className="board-edit-button" onClick={handleSubmit}>
          작성 완료
        </button>
        <button
          className="board-cancel-button"
          onClick={() => navigate("/boardList")}
        >
          취소
        </button>
      </div>
    </div >
  );
}

export default BoardWrite;
