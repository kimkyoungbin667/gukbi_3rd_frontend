import React, { useEffect, useState } from 'react';
import { Map, MapMarker, MapTypeControl, useKakaoLoader, ZoomControl } from "react-kakao-maps-sdk";
import '../../css/map/map.css'

function KakaoMap() {
    useKakaoLoader();

    const [mapCenter, setMapCenter] = useState({
        lat: 36.7472206,
        lng: 126.7038631,
    });
    const categoryColors = {
        "검색": "#ffeb3b",
        "카테고리2": "#8bc34a",
        "카테고리3": "#03a9f4",
        "카테고리4": "#03a9f4",
    };


    const [activeCategory, setActiveCategory] = useState("Food");

    useEffect(() => {
        if (navigator.geolocation) {
            // 위치 정보를 가져옴
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const latitude = position.coords.latitude; // 위도
                    const longitude = position.coords.longitude; // 경도

                    console.log("현재 위치: " + latitude + ", " + longitude);
                    setMapCenter({ lat: latitude, lng: longitude }); // 지도 중심 업데이트
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

    const renderMenuDetails = () => {
        switch (activeCategory) {
            case "검색":
                return (
                    <div className="search-detail">

                    </div>
                );
            case "카테고리2":
                return (
                    <div className="shopping-detail">
                        <h3>Shopping Category</h3>
                        <p>Here are the best shopping malls and stores!</p>
                        <button>View Stores</button>
                    </div>
                );
            case "카테고리3":
                return (
                    <div className="entertainment-detail">
                        <h3>Entertainment Category</h3>
                        <p>Explore cinemas, parks, and other entertainment venues!</p>
                        <button>View Venues</button>
                    </div>
                );
            case "카테고리4":
                return (
                    <div className="health-detail">
                        <h3>Health Category</h3>
                        <p>Here are health-related services like clinics and gyms.</p>
                        <button>View Clinics</button>
                    </div>
                );
            default:
                return (
                    <div className="default-detail">
                        <p>Please select a category.</p>
                    </div>
                );
        };
    }

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
                            placeholder="Search location..."
                        />
                        <button className="search-button">🔍</button>
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
                    {renderMenuDetails()}
                </div>
            </div>

            {/* 지도 */}
            <Map
                className="map-display"
                center={mapCenter}
                level={3}
            >
                <MapTypeControl position={"TOPRIGHT"} />
                <ZoomControl position={"RIGHT"} />
                <MapMarker // 마커를 생성합니다
                    position={mapCenter}
                />
            </Map>


        </div >
    );
}
export default KakaoMap;