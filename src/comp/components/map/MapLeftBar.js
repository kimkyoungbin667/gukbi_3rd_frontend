import { useState } from "react";

export default function MapLeftBar(props) {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const asd = props.searchResults;
    const pagination = props.pagination;
    const walks = props.walks;

    const getBackgroundColor = (index) => {
        const colors = ['#FFC1C1', '#FFD8B1', '#FFFACD', '#DFFFD6', '#B3E5FC', '#BDB3FF', '#E1BEE7']
        return colors[index % colors.length];
    };

    const getHoverBackgroundColor = (index) => {
        const colors = ['#FFB6B6', '#FFBB7F', '#FFF7A0', '#A4E1B5', '#91CFFF', '#B39DFF', '#D8A7DF'];
        return colors[index % colors.length];
    };

    if (props.category === '검색') {
        return (
            <div className="search-result">
                {props.category === '검색' && (
                    <div className="search-result-margin">
                        <div className="search-result-count">검색 결과 {pagination.totalCount} 건</div>
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
                                    onClick={(e) => {
                                        e.preventDefault();
                                        props.setMapData(
                                            {
                                                level: 3,
                                                position: {
                                                    lat: item.y,
                                                    lng: item.x
                                                }
                                            }
                                        )
                                    }}
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
                        {Array.from({ length: pagination.last }, (_, index) => {
                            const page = index + 1;
                            return (
                                <a
                                    key={page}
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        props.handlePageChange(page);
                                    }}
                                    style={{
                                        fontWeight: page === pagination.current ? 'bold' : 'normal',
                                        marginRight: '5px',
                                    }}
                                >
                                    {page}
                                </a>
                            );
                        })}
                    </div>
                )
                }


            </div >
        );
    } else if (props.category === '카테고리2') {
        return (<div>

        </div>
        )

    } else if (props.category === '카테고리3') {
        return (<div>
            카테고리 3
        </div>
        )

    }
    else if (props.category === 'ㅎㅇ') {
        return (
            <div className="search-result">
                {props.category === 'ㅎㅇ' && (
                    <div className="search-result-margin">
                        <div className="search-result-count">검색 결과 {walks ? walks.length : 0} 건</div>
                        {/* asd 배열을 순회하면서 동물병원 정보를 표시 */}
                        {walks && walks.length > 0 ? (
                            walks.map((item, index) => (
                                <div
                                    key={index}
                                    className="search-result-list"
                                    style={{
                                        backgroundColor: hoveredIndex === index
                                            ? getHoverBackgroundColor(index)  // 마우스가 올라갔을 때 배경색
                                            : getBackgroundColor(index)
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        props.setMapData(
                                            {
                                                level: 3,
                                                position: {
                                                    lat: item.paths[0].latitude,
                                                    lng: item.paths[0].longitude
                                                }
                                            });
                                    }}
                                    onMouseEnter={() => setHoveredIndex(index)}  // 마우스 올리기
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <div className="search-result-title">{item.walkName}</div>
                                    <div className="search-result-content">{item.walkDate}</div>
                                </div>
                            ))
                        ) : (
                            <p>검색 결과가 없습니다.</p>
                        )}

                    </div>
                )}


            </div>
        )

    }
} 