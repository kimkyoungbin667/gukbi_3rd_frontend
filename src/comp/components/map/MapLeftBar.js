import { useState } from "react";

export default function MapLeftBar(props) {
    const [selectedPlace, setSelectedPlace] = useState(null); // 클릭된 동물병원의 정보를 저장할 상태
    const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업창 열림/닫힘 상태
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const asd = props.data;

    const handleClick = (place) => {
        setSelectedPlace(place);  // 클릭한 동물병원의 정보를 상태에 저장
        setIsPopupOpen(true); // 팝업창 열기
    };

    const closePopup = () => {
        setIsPopupOpen(false); // 팝업창 닫기
        setSelectedPlace(null); // 선택된 병원 정보 초기화
    };

    const getBackgroundColor = (index) => {
        const colors = ['#FFC1C1', '#FFD8B1', '#FFFACD', '#DFFFD6', '#B3E5FC', '#BDB3FF', '#E1BEE7']
        return colors[index % colors.length];
    };

    const getHoverBackgroundColor = (index) => {
        const colors = ['#FFB6B6', '#FFBB7F', '#FFF7A0', '#A4E1B5', '#91CFFF', '#B39DFF', '#D8A7DF'];
        return colors[index % colors.length];
    };

    if (props.category == '검색') {
        return (
            <div className="search-result">
                {props.category === '검색' && (
                    <div className="search-result-margin">
                        <div className="search-result-count">검색 결과 {asd && asd.length > 0 ? asd.length : 0} 건</div>
                        {/* asd 배열을 순회하면서 동물병원 정보를 표시 */}
                        {asd && asd.length > 0 ? (
                            asd.map((item, index) => (
                                <div
                                    key={index}
                                    className="search-result-list"
                                    style={{
                                        backgroundColor: hoveredIndex === index
                                            ? getHoverBackgroundColor(index)  // 마우스가 올라갔을 때 배경색
                                            : getBackgroundColor(index)
                                    }}
                                    onClick={() => handleClick(item)}
                                    onMouseEnter={() => setHoveredIndex(index)}  // 마우스 올리기
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <div className="search-result-title">{item.place_name}</div>
                                    <div className="search-result-content">{item.address_name}</div>
                                </div>
                            ))
                        ) : (
                            <p>검색 결과가 없습니다.</p>
                        )}
                    </div>
                )}

                {/* 팝업창이 열려있을 때만 표시 */}
                {isPopupOpen && selectedPlace && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <button className="close-button" onClick={closePopup}>닫기</button>
                            <h3>{selectedPlace.place_name}</h3>
                            <p><strong>주소:</strong> {selectedPlace.address_name}</p>
                            <p><strong>도로명 주소:</strong> {selectedPlace.road_address_name}</p>
                            <p><strong>전화번호:</strong> {selectedPlace.phone || "정보 없음"}</p>
                            <p><strong>카테고리:</strong> {selectedPlace.category_name}</p>
                            <p><strong>상세 링크:</strong> <a href={selectedPlace.place_url} target="_blank" rel="noopener noreferrer">상세보기</a></p>
                        </div>
                    </div>
                )}
            </div>
        );
    } else if (props.category == '카테고리2') {
        return (<div>
            카테고리 2
        </div>
        )

    } else if (props.category == '카테고리3') {
        return (<div>
            카테고리 3
        </div>
        )

    }
    else if (props.category == '카테고리4') {
        return (<div>
            카테고리 4
        </div>
        )

    }
} 