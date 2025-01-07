import React, { useEffect, useRef, useState } from 'react';
import { Map, MapMarker, MapTypeControl, useKakaoLoader, ZoomControl } from "react-kakao-maps-sdk";

import '../../css/map/map.css'
import MapLeftBar from './MapLeftBar';

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


    const [regionName, setRegionName] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("동물병원");
    const [searchResult, setSearchResult] = useState([]);
    const [activeCategory, setActiveCategory] = useState("검색");
    const [userPosition, setUserPosition] = useState({
        lat: 36.7472206,
        lng: 126.7038631,
    });

    const categoryColors = {
        "검색": "#ffeb3b",
        "카테고리2": "#8bc34a",
        "카테고리3": "#03a9f4",
        "카테고리4": "#03a9f4",
    };

    function search2Km(latlng) {
        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(searchKeyword, function (data, status, pagination) {
            console.log(searchKeyword);
            if (status === kakao.maps.services.Status.OK) {
                console.log(pagination.totalCount);
                console.log(data);
                setSearchResult(data);
                //console.log(searchResult);
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                setSearchResult();
            }
        }, { location: latlng, radius: 2000 })

    }

    function updateRegionName(latlng) {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2RegionCode(latlng.getLng(), latlng.getLat(), function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                console.log(result);
            }
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


    }, []);





    return (
        <div className="map-body"
        >
            <div className="map-left-bar">
                {/* 검색창 */}
                <div className='map-left-bar-top'>
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="검색"
                        />
                        <button className="search-button" onClick={search2Km}>🔍</button>
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

                    <MapLeftBar category={activeCategory} data={searchResult}></MapLeftBar>
                    <div className='menu-item-none'></div>
                </div>

            </div>

            {/* 지도 */}
            <Map
                className="map-display"
                center={mapData.position}
                level={3}

                onDragEnd={(map) => {
                    const level = map.getLevel();
                    const latlng = map.getCenter();
                    setMapData({
                        level: level,
                        position: {
                            lat: latlng.getLat(),
                            lng: latlng.getLng(),
                        },
                    })
                    updateRegionName(latlng);
                    search2Km(latlng);
                    console.log(mapData);
                }}
            >


                <MapTypeControl position={"TOPRIGHT"} />
                <ZoomControl position={"RIGHT"} />
                <MapMarker // 마커를 생성합니다
                    position={userPosition}
                />
            </Map>

        </div >
    )
}
export default KakaoMap;

