import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import CommentArea from "../board/CommentArea.js";
import { jwtDecode } from "jwt-decode";
import { getBoardDetail, increaseView, boardDelete, upBoardPostLike, getCategoryContentId, getAccompanyContentId } from "../../api/board";
import '../../css/board/boardDetail.css';
import { getWalks } from "../../api/map.js";
import { CustomOverlayMap, Map, MapMarker, Polyline } from "react-kakao-maps-sdk";

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
    mapCategoryId: "0",
    mapAccompanyId: "0",
    likeCount: 0,
    isLiked: '',
    title: '',
    viewCount: 0,
    imageFiles: []
  });

  const [walkMap, setWalkMap] = useState();
  const [mapPlace, setMapPlace] = useState({ placeType: "", place: {} });

  function getWalkss() {
    const obj = {
      userIdx: 6
    }
    getWalks(obj).then(res => {
      console.log(res.data.data);
      const walkWithMatchingLogId = res.data.data.find(walk => walk.logId === boardContents.logId);

      if (walkWithMatchingLogId) {
        console.log(walkWithMatchingLogId);
        setWalkMap(walkWithMatchingLogId);
    }
    }).catch(err => {

    }) 
  }

  function getCategoryMap() {
    const obj = {
      contentId:boardContents.mapCategoryId,
    }
    console.log(obj.contentId+"1111111111111");
    getCategoryContentId(obj).then(res => {
      setMapPlace({placeType: "카테고리", place: res.data.data});
      console.log(res.data.data);
      console.log(walkMap);
    }).catch(err => {
    })

  }

  function getAccompanyMap() {
    const obj = {
      contentId: boardContents.mapAccompanyId,
    }
    getAccompanyContentId(obj).then(res => {
      setMapPlace({placeType: "동반가능", place: res.data.data});
      console.log(res.data.data);
    }).catch(err => {
    })
  }









  useEffect(() => {
    
    
    getWalkss();
    if(boardContents.mapCategoryId !== "0" && boardContents.mapCategoryId !== 0) {
      getCategoryMap();

    } else if (boardContents.mapAccompanyId !=="0" && boardContents.mapAccompanyId !==0) {
      getAccompanyMap();
    }
  }, [boardContents]);

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

    console.log(boardIdx);
    // 게시글 상세 갖고오기
    if (boardIdx !== null) {
      getBoardDetail({ boardIdx })
        .then(res => {
          console.log("갖고옴 : ",res.data);
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
      <div className="board-detail-out">
        <div className="board-detail-container">
          <h1 className="board-detail-title">{boardContents.title}</h1>
          <div className="board-detail-content">{boardContents.content}</div>
          <div className="map-preview">
                    {
                      mapPlace.placeType === "카테고리" && mapPlace.place !== null? (
                        <>
                          <div style={{ fontSize: "36px" }}> 장소</div>
                          <div style={{ width: "100%", height: "500px" }}>
                            <Map style={{ width: "100%", height: "500px", border: "1px solid #000", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            
                              level={1}
            
            
                              center={{ lat: mapPlace.place.y + 0.0003, lng: mapPlace.place.x }}
                            >
            
                              <MapMarker
                                position={{ lat: mapPlace.place.y, lng: mapPlace.place.x }}
                              >
                              </MapMarker>
                              <CustomOverlayMap position={{ lat: mapPlace.place.y, lng: mapPlace.place.x }}>
                                <div className="bubble">
                                  <span className="left">{mapPlace.place.placeName}</span><br />
            
                                  <span className="center">주소: {mapPlace.place.addressName}</span><br />
                                  <span className="center">도로명 주소: {mapPlace.place.roadAddressName}</span><br />
                                  <span className="center">전화번호: {mapPlace.place.phone || "정보 없음"}</span><br />
                                  <span className="center">
                                    <a href={mapPlace.place.placeUrl} target="_blank" rel="noopener noreferrer">
                                      상세보기 {mapPlace.place.category}
                                    </a>
                                  </span>
                                </div>
                              </CustomOverlayMap>
            
                            </Map></div>
                        </>) : mapPlace.placeType === "동반가능" ? (
                          <div style={{ width: "100%px", height: "500px" }}>
                            <Map style={{ width: "100%px", height: "500px", border: "1px solid #000", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            
                              level={1}
            
            
                              center={{ lat: mapPlace.place.mapy + 0.0003, lng: mapPlace.place.mapx }}
                            >
            
                              <MapMarker
                                position={{ lat: mapPlace.place.mapy, lng: mapPlace.place.mapx }}
                              >
                              </MapMarker>
                              <CustomOverlayMap position={{ lat: mapPlace.place.mapy, lng: mapPlace.place.mapx }}>
                                <div className="bubble">
                                  <span className="left">{mapPlace.place.title}</span><br />
            
                                  <span className="center">주소: {mapPlace.place.addr1}</span><br />
                                  <span className="center">도로명 주소: {mapPlace.place.roadAddressName}</span><br />
                                  <span className="center">전화번호: {mapPlace.place.tel || "정보 없음"}</span><br />
                                  <span className="center">
                                    <a href={mapPlace.place.placeUrl} target="_blank" rel="noopener noreferrer">
                                      상세보기 {mapPlace.place.category}
                                    </a>
                                  </span>
                                </div>
                              </CustomOverlayMap>
            
                            </Map></div>) : (<></>)
                    }
                    
                    {walkMap && (
                      <>
                        <div style={{ marginTop: "50px", fontSize: "36px" }}>산책</div>
                        <div style={{ width: "100%", height: "500px", }}>
                          <Map style={{ width: "100%", height: "500px", border: "1px solid #000", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            
                            level={3}
            
            
                            center={{ lat: walkMap.paths[0].latitude, lng: walkMap.paths[0].longitude }}
                          >
                            <Polyline path={[walkMap.paths.map((path, index) => (
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

          {boardContents.imageFiles !== null && (
            <div className="upload-images">
              {boardContents.imageFiles.map((image, index) => (
                <div key={index} className="upload-image">
                  <img
                    src={`http://58.74.46.219:33334/${image}`}
                    alt={`이미지 ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          )}
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
        >
          👍 {isLiked ? "Liked" : "Like"}
        </button>
      </div>

      <div className="goToboardList-btn-container">
        <button className="goToboardList-btn" onClick={handleGoToList}>
          목록으로
        </button>
      </div>

      {Number(userIdx) !== Number(boardContents.createdByUserIdx) && (
        <div className="board-detail-actions">
          <button className="chat-button">
            채팅 시작하기
          </button>
        </div>
      )}


      {boardIdx && <CommentArea boardIdx={boardIdx} />}

      <hr />
    </>
  );

}

export default BoardDetail;
