import { useState } from "react";
import { CustomOverlayMap, MapMarker } from "react-kakao-maps-sdk";

export default function MapSearchMarker(props) {

    const [searchInfoWindow, setSearchInfoWindow] = useState(null);

    const result = props.result;
    const category = props.category;
    const accompanyListForType = props.accompanyListForType;

    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => {
        setIsFavorite(prev => !prev);  // 즐겨찾기 상태를 토글
    };



    if (category === "카테고리") {
        return (

            <div>
                {category === "카테고리" && result.map((place, index) => (
                    <MapMarker key={index} position={{ lat: place.y, lng: place.x }} clickable onClick={() => { setSearchInfoWindow(place); console.log(place); console.log(searchInfoWindow) }}>
                    </MapMarker>
                )
                )
                }
                {
                    searchInfoWindow && (
                        <CustomOverlayMap
                            position={{
                                lat: searchInfoWindow.y, lng: searchInfoWindow.x
                            }} >
                            <div className="bubble">
                                <span className="left">{searchInfoWindow.place_name}</span>

                                {/* 즐겨찾기 별 버튼 */}
                                <button className={`favorite-btn ${isFavorite ? 'filled' : ''}`} onClick={toggleFavorite}>
                                    ★
                                </button>

                                {/* '닫기' 버튼 */}
                                <button className="xbox" onClick={() => setSearchInfoWindow(null)}></button><br />

                                <span className="center">주소: {searchInfoWindow.address_name}</span><br />
                                <span className="center">도로명 주소: {searchInfoWindow.road_address_name}</span><br />
                                <span className="center">전화번호: {searchInfoWindow.phone || "정보 없음"}</span><br />
                                <span className="center">
                                    <a href={searchInfoWindow.place_url} target="_blank" rel="noopener noreferrer">
                                        상세보기 {searchInfoWindow.category}
                                    </a>
                                </span><br />
                            </div>
                        </CustomOverlayMap>


                    )

                }
            </div >
        )
    }
    if (category === "동반가능") {
        return (
            <div>
                {category === "동반가능" && accompanyListForType.map((place, index) => (
                    <MapMarker key={index} position={{ lat: place.mapy, lng: place.mapx }} clickable onClick={() => { setSearchInfoWindow(place); console.log(place); console.log(searchInfoWindow) }}>
                    </MapMarker>
                )
                )
                }
                {
                    searchInfoWindow && (
                        <CustomOverlayMap
                            position={{
                                lat: searchInfoWindow.mapy, lng: searchInfoWindow.mapx
                            }} >
                            <div className="bubble">

                                <span className="left">{searchInfoWindow.place_name}</span>
                                <button className="xbox" onClick={() => setSearchInfoWindow()}></button><br />
                                <span className="center">주소: {searchInfoWindow.address_name}</span><br />
                                <span className="center">도로명 주소: {searchInfoWindow.road_address_name}</span><br />
                                <span className="center">전화번호: {searchInfoWindow.phone || "정보 없음"}</span><br />
                                <span className="center">카테고리: {searchInfoWindow.category_name}</span><br />
                                <span className="center"><a href={searchInfoWindow.place_url} target="_blank">상세보기 {searchInfoWindow.category}</a></span><br />

                            </div>
                        </CustomOverlayMap>


                    )

                }
            </div >

        )
    }
}