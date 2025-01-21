import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLikeLocation, getMapByPath } from "../../api/board";

import "../../css/board/boardWrite.css";
import { getAccompanyFav, getCategoryFav, getPetLists, getWalks } from "../../api/map";
import { CustomOverlayMap, Map, MapMarker, Polyline } from "react-kakao-maps-sdk";

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
  const [selectedFavType, setSelectedFavType] = useState("카테고리");
  const [selectedPlace, setSelectedPlace] = useState({ placeType: "", place: {} });


  const [categoryFav, setCategoryFav] = useState();
  const [accompanyFav, setAccompanyFav] = useState();

  // 산책 경로들
  const [myPets, setMyPets] = useState();
  const [myWalks, setMyWalks] = useState();
  const [selectedPet, setSelectedPet] = useState();

  const [selectedWalks, setSelectedWalks] = useState();


  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if(selectedPlace.placeType === "카테고리") {
      formData.append("mapCategoryId", selectedPlace.place.id);
      formData.append("mapAccompanyId", 0);
    } else if (selectedPlace.placeType === "동반가능") {
      formData.append("mapCategoryId", 0);
      formData.append("mapAccompanyId", selectedPlace.place.contentid);
    }
    formData.append("logId",selectedWalks.logId)


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
    } else {
      setIsPathModalOpen(true);
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


  function getCategoryFavorite() {
    const obj = {
      userIdx: 1
    }
    getCategoryFav(obj).then(res => {
      console.log(res.data);
      setCategoryFav(res.data.data);
    }).catch(err => {

    })
  }

  function getAccompanyFavorite() {
    const obj = {
      userIdx: 1
    }

    getAccompanyFav(obj).then(res => {
      console.log(res.data);
      setAccompanyFav(res.data.data);
    }).catch(err => {

    })
  }

  function getWalkss() {
    const obj = {
      userIdx: "6",
    }
    getWalks(obj).then(res => {
      console.log(res.data.data);
      setMyWalks(res.data.data);
    }).catch(err => {

    })
  }

  function getPetList() {
    const obj = {
      userIdx: 6
    }
    getPetLists(obj).then(res => {
      setMyPets(res.data.data);
      console.log(res.data.data);
    })
  }

  useEffect(() => {
    getAccompanyFavorite();
    getCategoryFavorite();
    getPetList();
    getWalkss();
  }, [])


  return (
    <div className="board-edit-container">
      <h1 className="board-edit-title">✍ 게시글 작성</h1>

      {/* 제목 입력 */}
      <div className="board-edit-input">
        <label htmlFor="title">제목</label>
        <input
          type="text"
          className="titleinput-area"
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
            onClick={(e) => {

              openModal("location");
            }}
          />

          <input
            type="button"
            id="path-share-btn"
            value="산책경로 공유 📌"
            onClick={() => { openModal("path") }}
          />
        </div>

        {/* 즐겨찾기한 경로 모달창 */}
        {isLikeModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content1">
              <h2>나의 즐겨찾기 장소 목록</h2>
              <input type="button" value='카테고리' onClick={() => setSelectedFavType("카테고리")}></input>
              <input type="button" value='동반가능' onClick={() => setSelectedFavType("동반가능")}></input>
              {/* 테이블 형식으로 변경 */}
              <table className="path-table">
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>장소명</th>
                    <th>전화번호</th>
                    <th>시작 시간</th>
                    <th>선택</th>
                  </tr>
                </thead>
                <tbody>

                  {selectedFavType === "카테고리" && categoryFav.length > 0 ? (
                    categoryFav.map((loc, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{loc.placeName}</td>
                        <td>{loc.phone}</td>
                        <td>{loc.roadAddressName}</td>

                        <td>
                          <button className="select-button" onClick={() => {

                            setSelectedPlace({ placeType: "카테고리", place: loc });

                            closeModal("location");

                          }}>
                            선택
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : selectedFavType === "동반가능" && accompanyFav.length > 0 ? (
                    accompanyFav.map((loc, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{loc.title}</td>
                        <td>{loc.tel || "정보없음"} </td>
                        <td>{loc.addr1}</td>
                        <td>
                          <button className="select-button" onClick={() => {

                            setSelectedPlace({ placeType: "동반가능", place: loc });

                            closeModal("location");

                          }}>
                            선택
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">데이터가 없습니다.</td>
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
            <div className="modal-content1">
              {selectedPet ? (
                <>
                  <div style={{ display: "flex", fontFamily: "catFont" }}>
                    <div
                      onClick={() => setSelectedPet(null)}>←</div>
                    <div className="pet-walk-path" style={{ textAlign: "center", fontSize: "32px", fontWeight: "bold", marginBottom: "10px", width: "100%" }}>
                      <div>{selectedPet.dog_name}의 산책 경로</div>
                    </div>
                  </div>
                  <table className="path-table">
                    <thead>
                      <tr>
                        <th>번호</th>
                        <th>산책 이름</th>
                        <th>날짜</th>
                        <th>시작 시간</th>
                        <th>종료 시간</th>
                        <th>선택</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myWalks.length > 0 ? (
                        myWalks.map((walk, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{walk.walkName}</td>
                            <td>{walk.walkDate?.slice(0, 10)}</td>
                            <td>{walk.startTime?.slice(11, 16)}</td>
                            <td>{walk.endTime?.slice(11, 16)}</td>
                            <td>
                              <button className="select-button" onClick={() => {
                                setSelectedWalks(walk);
                                closeModal("path");
                              }}>
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
                  <button onClick={() => { closeModal("path"); setSelectedPet(); }} className="close-modal-button">
                    취소
                  </button></>
              ) : (
                <>
                  <h2>Pets</h2>
                  {myPets && myPets.length > 0 ? (
                    myPets.map((pet, index) => (
                      <div className="search-result-list"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedPet(pet); // 반려동물 선택

                        }}>
                        <div style={{ display: "flex" }}>
                          <img
                            src={`http://58.74.46.219:33334/upload/${pet.profile_url}`}
                            alt="반려동물 사진"
                            className="pet-image"
                          />
                          <div>
                            <div
                              className="search-result-title"
                              style={{
                                marginLeft: "20px",
                                marginTop: "6px",
                                fontSize: "38px",
                              }}
                            >
                              {pet.dog_name}
                            </div>
                            <div>추가 정보</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (<p> none</p>)}
                  <button onClick={() => { closeModal("path"); setSelectedPet(); }} className="close-modal-button">
                    취소
                  </button>
                </>
              )}
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


      <div className="map-preview">
        {
          selectedPlace.placeType === "카테고리" ? (
            <>
              <div style={{ fontSize: "36px" }}> 장소</div>
              <div style={{ width: "100%", height: "500px" }}>
                <Map style={{ width: "100%", height: "500px", border: "1px solid #000", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}

                  level={1}


                  center={{ lat: selectedPlace.place.y + 0.0003, lng: selectedPlace.place.x }}
                >

                  <MapMarker
                    position={{ lat: selectedPlace.place.y, lng: selectedPlace.place.x }}
                  >
                  </MapMarker>
                  <CustomOverlayMap position={{ lat: selectedPlace.place.y, lng: selectedPlace.place.x }}>
                    <div className="bubble">
                      <span className="left">{selectedPlace.place.placeName}</span><br />

                      <span className="center">주소: {selectedPlace.place.addressName}</span><br />
                      <span className="center">도로명 주소: {selectedPlace.place.roadAddressName}</span><br />
                      <span className="center">전화번호: {selectedPlace.place.phone || "정보 없음"}</span><br />
                      <span className="center">
                        <a href={selectedPlace.place.placeUrl} target="_blank" rel="noopener noreferrer">
                          상세보기 {selectedPlace.place.category}
                        </a>
                      </span>
                    </div>
                  </CustomOverlayMap>

                </Map></div>
            </>) : selectedPlace.placeType === "동반가능" ? (
              <div style={{ width: "100%px", height: "500px" }}>
                <Map style={{ width: "100%px", height: "500px", border: "1px solid #000", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}

                  level={1}


                  center={{ lat: selectedPlace.place.mapy + 0.0003, lng: selectedPlace.place.mapx }}
                >

                  <MapMarker
                    position={{ lat: selectedPlace.place.mapy, lng: selectedPlace.place.mapx }}
                  >
                  </MapMarker>
                  <CustomOverlayMap position={{ lat: selectedPlace.place.mapy, lng: selectedPlace.place.mapx }}>
                    <div className="bubble">
                      <span className="left">{selectedPlace.place.title}</span><br />

                      <span className="center">주소: {selectedPlace.place.addr1}</span><br />
                      <span className="center">도로명 주소: {selectedPlace.place.roadAddressName}</span><br />
                      <span className="center">전화번호: {selectedPlace.place.tel || "정보 없음"}</span><br />
                      <span className="center">
                        <a href={selectedPlace.place.placeUrl} target="_blank" rel="noopener noreferrer">
                          상세보기 {selectedPlace.place.category}
                        </a>
                      </span>
                    </div>
                  </CustomOverlayMap>

                </Map></div>) : (<></>)
        }

        {selectedWalks && (
          <>
            <div style={{ marginTop: "50px", fontSize: "36px" }}>산책asdasdasdads</div>
            <div style={{ width: "100%", height: "500px", }}>
              <Map style={{ width: "100%", height: "500px", border: "1px solid #000", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}

                level={3}


                center={{ lat: selectedWalks.paths[0].latitude, lng: selectedWalks.paths[0].longitude }}
              >
                <Polyline path={[selectedWalks.paths.map((path, index) => (
                  { lat: path.latitude, lng: path.longitude }
                ))
                ]}

                  strokeWeight={6}
                  strokeColor="#FFAE00"
                  strokeOpacity={1}
                  strokeStyle="solid"
                  endArrow

                >

                </Polyline>
              </Map>

            </div>
          </>
        )
        }
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
