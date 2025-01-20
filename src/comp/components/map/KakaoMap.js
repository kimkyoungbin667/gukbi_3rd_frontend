import React, { useEffect, useState } from 'react';
import { Map, MapInfoWindow, MapMarker, MapTypeControl, Polyline, useKakaoLoader, ZoomControl } from "react-kakao-maps-sdk";

import '../../css/map/map.css'
import MapLeftBar from './MapLeftBar';
import { getAcommpanyDetails, getWalks, getAccompanyFav, getCategoryFav, getPetLists, addAccompanyFav, addCategoryFav, deleteAccompanyFav, deleteCategoryFav } from '../../api/map';
import MapSearchMarker from './MapSearchMarker';
import MapWalkPolyline from './MapWalkPolyline';

function KakaoMap() {

    useKakaoLoader();
    const { kakao } = window;
    const [mapData, setMapData] = useState({
        level: 3,
        position: {
            lat: 37.5542442978668,
            lng: 126.934199807183,
        }
    })

    const [myWalks, setMyWalks] = useState([]);
    const [myPets, setMyPets] = useState([]);

    function getPetList() {
        const obj = {
            userIdx: 6
        }
        getPetLists(obj).then(res => {
            setMyPets(res.data.data);
            console.log(res.data.data);
        })
    }


    const [regionName, setRegionName] = useState("");
    const [userPosition, setUserPosition] = useState({
        lat: 36.7472206,
        lng: 126.7038631,
    });

    const [activeMenu, setActiveMenu] = useState("카테고리");

    const menu = ["카테고리", "동반가능", "즐겨찾기", "산책기록"];
    //카테고리 관련
    const categories = ["동물병원", "애견샵", "애견카페", "고양이카페"];
    const [searchState, setSearchState] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("동물병원");
    const [searchResult, setSearchResult] = useState([]);
    const [pagination, setPagination] = useState({
        totalCount: 0,
        current: 1,
        last: 0,
    });


    //동반가능 시설 관련
    const contentTypes = { 12: "관광지", 14: "문화시설", 28: "레포츠", 32: "숙박", 38: "쇼핑", 39: "음식점" };
    const [selectedType, setSelectedType] = useState("12");
    const [accompanyListForType, setAccompanyListForType] = useState();
    const [accompanyList, setAccompanyList] = useState([]);




    const [selectedFavType, setSelectedFavType] = useState('카테고리');
    const [myCategoryFav, setMyCategoryFav] = useState([]);
    const [myAccompanyFav, setMyAccompanyFav] = useState([]);


    //즐겨찾기 가져오기기
    function getCategoryFavorite() {
        const obj = {
            userIdx: 6
        }
        getCategoryFav(obj).then(res => {
            console.log(res.data);

            const updatedFavorites = res.data.data.map(item => ({
                ...item,
                isFavorite: true // 모든 항목에 isFavorite을 true로 추가
            }));
            setMyCategoryFav(updatedFavorites);

        }).catch(err => {

        })
    }

    function getAccompanyFavorite() {
        const obj = {
            userIdx: 6
        }

        getAccompanyFav(obj).then(res => {
            console.log(res.data);
            const updatedFavorites = res.data.data.map(item => ({
                ...item,
                isFavorite: true // 모든 항목에 isFavorite을 true로 추가
            }));

            setMyAccompanyFav(updatedFavorites);

        }).catch(err => {

        })
    }

    //즐겨찾기 추가
    function addCategoryFavorite(place) {
        const obj = {
            userIdx: 6,
            addressName: place.address_name,
            id: place.id,
            phone: place.phone,
            placeName: place.place_name,
            placeUrl: place.place_url,
            roadAddressName: place.road_address_name,
            x: place.x,
            y: place.y
        }

        addCategoryFav(obj).then(res => {
            return getCategoryFavorite();
        })

    }

    function addCategoryFavorite1(place) {
        const obj = {
            userIdx: 6,
            addressName: place.addressName,
            id: place.id,
            phone: place.phone,
            placeName: place.placeName,
            placeUrl: place.placeUrl,
            roadAddressName: place.roadAddressName,
            x: place.x,
            y: place.y
        }

        addCategoryFav(obj).then(res => {
            return getCategoryFavorite();
        })

    }


    function addAccompanyFavorite(contentId) {
        const obj = {
            userIdx: 6,
            contentId: contentId
        }

        addAccompanyFav(obj).then(res => {
            return getAccompanyFavorite();
        })

    }

    function deleteCategoryFavorite(id) {
        const obj = {
            userIdx: 6,
            id: id
        }

        deleteCategoryFav(obj).then(res => {
            return getCategoryFavorite();
        })

    }

    function deleteAccompanyFavorite(contentId) {
        const obj = {
            userIdx: 6,
            contentId: contentId
        }

        deleteAccompanyFav(obj).then(res => {
            return getAccompanyFavorite();
        })

    }





    //동반가능리스트 불러오기기
    function getAcommpanyList() {
        getAcommpanyDetails().then(res => {
            console.log(res.data)
            const updatedList = res.data.data.map(item => {
                const isFavorite = myAccompanyFav.some(fav => fav.contentId === item.contentId);
                return {
                    ...item,
                    isFavorite,
                };
            });

            setAccompanyList(updatedList);

        }).catch(err => {

        })
    }

    //동반가능리스트 항목선택택
    function filterByContentTypeId(contentTypeId) {
        setAccompanyListForType(accompanyList.filter(item => item.contenttypeid === contentTypeId));

    }


    //카테고리 검색
    const searchPlace = (page = 1) => {
        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(searchKeyword, function (data, status, pagination) {
            console.log(searchKeyword);
            if (status === kakao.maps.services.Status.OK) {
                console.log(pagination.totalCount);
                console.log(pagination);
                console.log(data);

                const updatedSearchResult = data.map(place => {
                    const isFavorite = myCategoryFav.some(fav => fav.id === place.id);
                    return {
                        ...place,
                        isFavorite,
                    };
                });
                console.log(updatedSearchResult);






                setSearchResult(updatedSearchResult);
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
        }, { x: mapData.position.lng, y: mapData.position.lat, radius: 2000, size: 14, page: page })

    }
    //카테고리 페이지 변경
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

    //산책기록 가져오기
    function getWalkss() {
        const obj = {
            userIdx: "6",
        }
        getWalks(obj).then(res => {

            setMyWalks(res.data.data);
            console.log(res.data.data);
            console.log(res.data.data);
            console.log(res.data.data);
        }).catch(err => {

        })
    }



    useEffect(() => {
        // if (navigator.geolocation) {
        //     // 위치 정보를 가져옴
        //     navigator.geolocation.getCurrentPosition(
        //         function (position) {
        //             const latitude = position.coords.latitude; // 위도
        //             const longitude = position.coords.longitude; // 경도
        //             console.log("현재 위치: " + latitude + ", " + longitude);
        //             setUserPosition({ lat: latitude, lng: longitude }); // 지도 중심 업데이트
        //             setMapData({
        //                 level: 3,
        //                 position: {
        //                     lat: latitude, lng: longitude,
        //                 }
        //             })
        //         },
        //         function (error) {
        //             // 에러 처리
        //             alert("위치 정보를 가져오는 데 실패했습니다. 에러 코드: " + error.code);
        //         }
        //     );
        // } else {
        //     alert("이 브라우저는 Geolocation을 지원하지 않습니다.");
        // }
        getWalkss();
        getAccompanyFavorite();
        getCategoryFavorite();
        getAcommpanyList();
        getPetList();
    }, []);


    useEffect(() => {
        updateRegionName();
        if (!searchState) {
            searchPlace();
        }
    }, [mapData, searchKeyword])

    useEffect(() => {
        filterByContentTypeId(selectedType);
    }, [accompanyList, selectedType])

    return (
        <div className="map-body">
            <div className="map-left-bar">
                {/* 검색창 */}
                <div className='map-left-bar-top'>
                    <div className="map-left-bar-menu">
                        {menu.map((item) => (
                            <div
                                key={item}
                                className={`menu-item ${activeMenu === item ? "active" : ""}`}
                                onClick={() => setActiveMenu(item)}
                            >
                                {item}
                            </div>
                        ))}

                    </div>
                </div>
                {/* 선택한 카테고리에 따른 메뉴 아이템 영역 */}

                <div className="menu-item-detail">

                    <MapLeftBar menu={activeMenu} categories={categories} setSearchKeyword={setSearchKeyword}
                        searchKeyword={searchKeyword} searchState={searchState} setSearchState={setSearchState}
                        searchResults={searchResult}
                        pagination={pagination} handlePageChange={handlePageChange}


                        //동반가능
                        accompanyList={accompanyList} contentTypes={contentTypes} accompanyListForType={accompanyListForType}
                        filterByContentTypeId={filterByContentTypeId}
                        selectedType={selectedType} setSelectedType={setSelectedType}


                        //즐겨찾기
                        categoryFav={myCategoryFav} accompanyFav={myAccompanyFav}
                        selectedFavType={selectedFavType} setSelectedFavType={setSelectedFavType}

                        //산책기록
                        myPets={myPets} walks={myWalks}



                        setMapData={setMapData}
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
                    if (!searchState) {
                        setMapData({
                            level: level,
                            position: {
                                lat: latlng.getLat(),
                                lng: latlng.getLng(),
                            },
                        });
                    }
                }}
            >

                <MapTypeControl position={"TOPRIGHT"} />
                <ZoomControl position={"RIGHT"} />

                <MapSearchMarker result={searchResult} menu={activeMenu} accompanyListForType={accompanyListForType}
                    selectedFavType={selectedFavType} myCategoryFav={myCategoryFav} myAccompanyFav={myAccompanyFav}
                    addAccompanyFavorite={addAccompanyFavorite} addCategoryFavorite={addCategoryFavorite} addCategoryFavorite1={addCategoryFavorite1}
                    deleteAccompanyFavorite={deleteAccompanyFavorite} deleteCategoryFavorite={deleteCategoryFavorite}
                />
                <MapWalkPolyline walks={myWalks} category={activeMenu} />

            </Map>


        </div >
    )
}
export default KakaoMap;

