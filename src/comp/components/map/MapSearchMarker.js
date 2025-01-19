import { useState } from "react";
import { CustomOverlayMap, MapMarker } from "react-kakao-maps-sdk";

export default function MapSearchMarker(props) {

    const [searchInfoWindow, setSearchInfoWindow] = useState(null);

    const result = props.result;
    const menu = props.menu;

    const accompanyListForType = props.accompanyListForType;


    const contentTypes = { 12: "관광지", 14: "문화시설", 28: "레포츠", 32: "숙박", 38: "쇼핑", 39: "음식점" };

    const selectedFavType = props.selectedFavType;
    const myCategoryFav = props.myCategoryFav;
    const myAccompanyFav = props.myAccompanyFav;



    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => {
        setIsFavorite(prev => !prev);  // 즐겨찾기 상태를 토글
    };



    if (menu === "카테고리") {
        return (

            <div>
                {menu === "카테고리" && result.map((place, index) => (
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
                                <div className="title">
                                    <div className="">{searchInfoWindow.place_name}</div>
                                    {/* 즐겨찾기 별 버튼 */}
                                    <button className={`favorite-btn ${isFavorite ? 'filled' : ''}`} onClick={toggleFavorite}>
                                        ★
                                    </button>

                                    {/* '닫기' 버튼 */}
                                    <button className="xbox" onClick={() => setSearchInfoWindow(null)}></button>
                                </div>
                                <div className="content">{searchInfoWindow.address_name}</div>
                                <div className="content">{searchInfoWindow.road_address_name}</div>
                                <div className="content">{searchInfoWindow.phone || "정보 없음"}</div>
                                <div className="content" >
                                    <a href={searchInfoWindow.place_url} target="_blank" rel="noopener noreferrer" style={{ color: "#2e75b6" }}>
                                        상세보기
                                    </a>
                                </div><br />
                            </div>
                        </CustomOverlayMap>


                    )

                }
            </div >
        )
    }
    if (menu === "동반가능") {
        return (
            <div>
                {menu === "동반가능" && accompanyListForType.map((place, index) => (
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
                                <div className="title">
                                    <div className="">{searchInfoWindow.title}</div>
                                    {/* 즐겨찾기 별 버튼 */}
                                    <button className={`favorite-btn ${isFavorite ? 'filled' : ''}`} onClick={toggleFavorite}>
                                        ★
                                    </button>

                                    {/* '닫기' 버튼 */}
                                    <button className="xbox" onClick={() => setSearchInfoWindow(null)}></button>
                                </div>
                                <div className="content">{searchInfoWindow.addr1}</div>
                                <div className="content">{contentTypes[searchInfoWindow.contenttypeid] || "알 수 없음"}</div>
                                <div className="content">{searchInfoWindow.tel || "번호정보 없음"}</div>
                                <div className="content" >
                                    <a href={searchInfoWindow.place_url} target="_blank" rel="noopener noreferrer" style={{ color: "#2e75b6" }}>
                                        상세보기
                                    </a>
                                </div><br />
                            </div>
                        </CustomOverlayMap>


                    )

                }
            </div >

        )
    }
    if (menu === "즐겨찾기") {
        return (
            <div>
                {selectedFavType === "카테고리" && myCategoryFav.map((place, index) => (
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
                                <div className="title">
                                    <div className="">{searchInfoWindow.placeName}</div>
                                    {/* 즐겨찾기 별 버튼 */}
                                    <button className={`favorite-btn ${isFavorite ? 'filled' : ''}`} onClick={toggleFavorite}>
                                        ★
                                    </button>

                                    {/* '닫기' 버튼 */}
                                    <button className="xbox" onClick={() => setSearchInfoWindow(null)}></button>
                                </div>
                                <div className="content">{searchInfoWindow.addressName}</div>
                                <div className="content">{searchInfoWindow.roadAddressName}</div>
                                <div className="content">{searchInfoWindow.phone || "정보 없음"}</div>
                                <div className="content" >
                                    <a href={searchInfoWindow.placeUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#2e75b6" }}>
                                        상세보기
                                    </a>
                                </div><br />
                            </div>
                        </CustomOverlayMap>


                    )

                }


                {selectedFavType === "동반가능" && myAccompanyFav.map((place, index) => (
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
                                <div className="title">
                                    <div className="">{searchInfoWindow.title}</div>
                                    {/* 즐겨찾기 별 버튼 */}
                                    <button className={`favorite-btn ${isFavorite ? 'filled' : ''}`} onClick={toggleFavorite}>
                                        ★
                                    </button>

                                    {/* '닫기' 버튼 */}
                                    <button className="xbox" onClick={() => setSearchInfoWindow(null)}></button>
                                </div>
                                <div className="content">{searchInfoWindow.addr1}</div>
                                <div className="content">{contentTypes[searchInfoWindow.contenttypeid] || "알 수 없음"}</div>
                                <div className="content">{searchInfoWindow.tel || "번호정보 없음"}</div>
                                <div className="content" >
                                    <a href={searchInfoWindow.place_url} target="_blank" rel="noopener noreferrer" style={{ color: "#2e75b6" }}>
                                        상세보기
                                    </a>
                                </div><br />
                            </div>
                        </CustomOverlayMap>


                    )

                }


            </div>
        )
    }


}