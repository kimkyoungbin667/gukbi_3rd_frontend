import React, { useEffect, useState } from 'react';
import { Map, MapInfoWindow, MapMarker, MapTypeControl, Polyline, useKakaoLoader, ZoomControl } from "react-kakao-maps-sdk";

import '../../css/map/map.css'
import MapLeftBar from './MapLeftBar';
import { getWalks } from '../../api/map';
import MapSearchMarker from './MapSearchMarker';
import MapWalkPolyline from './MapWalkPolyline';

function KakaoMap() {
    const { kakao } = window;
    const [mapData, setMapData] = useState({
        level: 0,
        position: {
            lat: 0,
            lng: 0,
        }
    })
    const [state, setState] = useState({
        // 지도의 초기 위치
        center: { lat: 33.450701, lng: 126.570667 },
        // 지도 위치 변경시 panto를 이용할지에 대해서 정의
        isPanto: false,
    })

    const [myWalks, setMyWalks] = useState([]);

    const [regionName, setRegionName] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("동물병원");


    const [searchResult, setSearchResult] = useState([]);
    const [pagination, setPagination] = useState({
        totalCount: 0,
        current: 1,
        last: 0,
    });

    const [activeCategory, setActiveCategory] = useState("검색");
    const [userPosition, setUserPosition] = useState({
        lat: 36.7472206,
        lng: 126.7038631,
    });

    const categoryColors = {
        "검색": "#ffeb3b",
        "카테고리2": "#8bc34a",
        "카테고리3": "#03a9f4",
        "ㅎㅇ": "#03a9f4",
    };

    const searchPlace = (page = 1) => {
        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(searchKeyword, function (data, status, pagination) {
            console.log(searchKeyword);
            if (status === kakao.maps.services.Status.OK) {
                console.log(pagination.totalCount);
                console.log(pagination);
                console.log(data);
                setSearchResult(data);
                setPagination({
                    totalCount: pagination.totalCount,
                    current: pagination.current,
                    last: pagination.last,
                });
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

                setSearchResult([]);
                setPagination({
                    totalCount: 0,
                    current: 1,
                    last: 0,
                });
            }
        }, { x: mapData.position.lng, y: mapData.position.lat, radius: 2000, size: 7, page: page })

    }

    const handlePageChange = (page) => {
        searchPlace(page); // 새로운 페이지 검색
    };

    function updateRegionName() {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2RegionCode(mapData.position.lng, mapData.position.lat, function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                console.log(result);
            }
        })
    }

    function getWalkss() {
        const obj = {
            userIdx: "1",
        }
        getWalks(obj).then(res => {

            setMyWalks(res.data.data);
        }).catch(err => {

        })

    }

    useEffect(() => {
        if (navigator.geolocation) {
            // 위치 정보를 가져옴
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const latitude = position.coords.latitude; // 위도
                    const longitude = position.coords.longitude; // 경도
                    console.log("현재 위치: " + latitude + ", " + longitude);
                    setUserPosition({ lat: latitude, lng: longitude }); // 지도 중심 업데이트
                    setMapData({
                        level: 3,
                        position: {
                            lat: latitude, lng: longitude,
                        }
                    })
                },
                function (error) {
                    // 에러 처리
                    alert("위치 정보를 가져오는 데 실패했습니다. 에러 코드: " + error.code);
                }
            );
        } else {
            alert("이 브라우저는 Geolocation을 지원하지 않습니다.");
        }
        getWalkss();

    }, []);


    useEffect(() => {
        updateRegionName();
        searchPlace();
        console.log(myWalks);
    }, [mapData])



    return (
        <div className="map-body">
            <div className="map-left-bar">
                {/* 검색창 */}
                <div className='map-left-bar-top'>
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="검색"
                        />
                        <button className="search-button" onClick={searchPlace}>🔍</button>
                    </div>

                    <div className="map-left-bar-menu">
                        {Object.keys(categoryColors).map((category) => (
                            <div
                                key={category}
                                className={`menu-item ${activeCategory === category ? "active" : ""}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </div>
                        ))}

                    </div>
                </div>
                {/* 선택한 카테고리에 따른 메뉴 아이템 영역 */}

                <div className="menu-item-detail">

                    <MapLeftBar category={activeCategory} searchResults={searchResult}
                        pagination={pagination} handlePageChange={handlePageChange}
                        walks={myWalks} setMapData={setMapData}
                    />
                    <div className='menu-item-none'></div>
                </div>

            </div>

            {/* 지도 */}
            <Map
                className="map-display"
                center={mapData.position}
                style={{
                    position: "relative"
                }}
                level={mapData.level}
                zoomable={true}
                // onDragEnd={(map) => {
                //     const level = map.getLevel();
                //     const latlng = map.getCenter();
                //     setMapData({
                //         level: level,
                //         position: {
                //             lat: latlng.getLat(),
                //             lng: latlng.getLng(),
                //         },
                //     });


                // }}
                onIdle={(map) => {
                    const level = map.getLevel();
                    const latlng = map.getCenter();
                    setMapData({
                        level: level,
                        position: {
                            lat: latlng.getLat(),
                            lng: latlng.getLng(),
                        },
                    });
                }}
            >

                <MapTypeControl position={"TOPRIGHT"} />
                <ZoomControl position={"RIGHT"} />
                <MapMarker // 마커를 생성합니다
                    position={userPosition}

                >
                    <div style={{ padding: "5px", color: "#000" }}>Hello World!</div>
                </MapMarker>
                <MapSearchMarker result={searchResult} category={activeCategory} />
                <MapWalkPolyline walks={myWalks} category={activeCategory} />

            </Map>


        </div >
    )
}
export default KakaoMap;

