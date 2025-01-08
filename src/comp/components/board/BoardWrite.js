import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { BoardWriteAction } from "../../api/board";
import "../../css/board/boardWrite.css";

function BoardWrite() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [nowImage, setNowImage] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    // 이미지 파일 하나씩 append
    imageFiles.forEach((file) => {
      formData.append(`images`, file);
    });

    try {
      const res = await fetch("http://localhost:8080/api/board/createBoardPost", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // JWT 추가
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


  // 업로드 이미지 리스트에 추가
  const handleImageFile = (e) => {
    const file = e.target.files[0]; // 선택한 파일

    if (file) {

      setImageFiles((prev) => [
        ...prev,
        file
      ]);

      const previewUrl = URL.createObjectURL(file); // 브라우저용 미리보기 URL 생성
      setNowImage(previewUrl); // 미리보기 URL 저장
    }
  };

  useEffect(() => {
    console.log(imageFiles);
  }, [imageFiles]);

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

      {/* 이미지 업로드 */}
      <div className="board-image-input">

        <div className="file-upload">
          <label htmlFor="file-upload">🖼️ 이미지 업로드</label>
          <input type="file" accept="image/*" id="file-upload" onChange={handleImageFile}></input>
        </div>

        {/* 업로드한 이미지 미리보기 */}
        <div className="images-preview">
          {imageFiles.length > 0 && imageFiles.map((image, index) => {
            return (
              <div key={index} className="preview-image">
                <img key={index} src={URL.createObjectURL(image)} alt="미리보기" style={{ width: "200px" }} />
                <button type="button">제거</button>
              </div>
            )
          })}
        </div>

      </div>

      {/* 작성 완료 버튼 */}
      <div div className="board-edit-actions" >
        <button className="edit-button" onClick={handleSubmit}>
          작성 완료
        </button>
      </div>
    </>
  );
}

export default BoardWrite;
