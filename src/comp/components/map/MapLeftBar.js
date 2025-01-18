import { useState } from "react";

export default function MapLeftBar(props) {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [selectedType, setSelectedType] = useState();

    const [selectedFavType, setSelectedFavType] = useState('카테고리');

    const asd = props.searchResults;
    const pagination = props.pagination;
    const categories = props.categories;


    const accompanyListForType = props.accompanyListForType;
    const contentTypes = props.contentTypes;
    const [currentPage, setCurrentPage] = useState(1);


    const favoriteList = ["카테고리", "동반가능"];
    const categoryFav = props.categoryFav;
    const accompanyFav = props.accompanyFav;

    const walks = props.walks;
    const getBackgroundColor = (index) => {
        const colors = ['#FFC1C1', '#FFD8B1', '#FFFACD', '#DFFFD6', '#B3E5FC', '#BDB3FF', '#E1BEE7']
        return colors[index % colors.length];
    };

    const getHoverBackgroundColor = (index) => {
        const colors = ['#FFB6B6', '#FFBB7F', '#FFF7A0', '#A4E1B5', '#91CFFF', '#B39DFF', '#D8A7DF'];
        return colors[index % colors.length];
    };

    if (props.menu === '카테고리') {
        return (
            <>
                <div className="categories">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className={`category-item ${props.searchKeyword === category ? "selected" : ""
                                }`}
                            onClick={() => props.setSearchKeyword(category)}
                        >
                            {category}
                        </div>
                    ))}
                </div>

                <div className="search-result">
                    {props.menu === '카테고리' && (
                        <div className="search-result-margin">
                            <div style={{ display: "flex" }}>
                                <div className="search-result-count">검색 결과 {pagination.totalCount} 건
                                </div>
                                <div className="search-result-set">
                                    검색결과 고정
                                    <input
                                        type="checkbox"
                                        className="search-result-checkbox"
                                        checked={props.searchState}
                                        onChange={() => props.setSearchState(!props.searchState)}
                                    />
                                </div>
                            </div>

                            {/* asd 배열을 순회하면서 동물병원 정보를 표시 */}
                            <div className="search-result-area">
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
                                )

                                    : (
                                        <p>검색 결과가 없습니다.</p>
                                    )}
                            </div>
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
            </>
        );
    } else if (props.menu === '동반가능') {

        const itemsPerPage = 7;

        // 페이지 네이션을 위해 현재 페이지 상태 관리


        // 현재 페이지에 해당하는 데이터만 필터링
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = accompanyListForType.slice(indexOfFirstItem, indexOfLastItem);

        // 페이지 번호 계산
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(accompanyListForType.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }

        return (
            <>
                <div className="categories">
                    {Object.entries(contentTypes).map(([contentTypeCode, contentType]) => (
                        <div
                            key={contentTypeCode}
                            className={`category-item ${selectedType === contentTypeCode ? "selected" : ""
                                }`}
                            onClick={() => {
                                setSelectedType(contentTypeCode);
                                props.filterByContentTypeId(contentTypeCode);
                            }}
                        >
                            {contentType}
                        </div>
                    ))}
                </div>

                <div className="search-result">
                    {props.menu === '동반가능' && (
                        <div className="search-result-margin">
                            <div style={{ display: "flex" }}>
                                <div className="search-result-count">검색 결과 {accompanyListForType.length} 건
                                </div>
                            </div>

                            <div className="search-result-area">
                                {currentItems && currentItems.length > 0 ? (
                                    currentItems.map((item, index) => (
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
                                                        level: 6,
                                                        position: {
                                                            lat: item.mapy,
                                                            lng: item.mapx
                                                        }
                                                    }
                                                )
                                            }}
                                            onMouseEnter={() => setHoveredIndex(index)}  // 마우스 올리기
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        >
                                            <div className="search-result-title">{item.title}</div>
                                            <div className="search-result-content">{item.addr1}</div>
                                        </div>
                                    ))
                                )

                                    : (
                                        <p>검색 결과가 없습니다.</p>
                                    )}
                            </div>
                            <div className="pagination">
                                {pageNumbers.map(number => (
                                    <span
                                        key={number}
                                        className={`page-number ${currentPage === number ? "selected" : ""}`}
                                        onClick={() => setCurrentPage(number)}
                                    >
                                        {number}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )
                    }


                </div >
            </>

        );

    } else if (props.menu === '즐겨찾기') {
        return (
            <>
                <div className="categories">
                    {favoriteList.map((category, index) => (
                        <div
                            key={index}
                            className={`category-item ${selectedFavType === category ? "selected" : ""
                                }`}
                            onClick={() => setSelectedFavType(category)}
                        >
                            {category}
                        </div>
                    ))}
                </div>
                <div className="search-result">
                    {/*즐겨찾기 카테고리 항목*/}
                    {props.menu === '즐겨찾기' && selectedFavType === '카테고리' && (
                        <div className="search-result-margin">
                            <div style={{ display: "flex" }}>
                                <div className="search-result-count">검색 결과 {categoryFav.length} 건
                                </div>

                            </div>
                            <div className="search-result-area">
                                {categoryFav && categoryFav.length > 0 ? (
                                    categoryFav.map((item, index) => (

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
                                            <div className="search-result-title">{item.placeName}</div>
                                            <div className="search-result-content">{item.addressName}</div>
                                        </div>
                                    ))
                                )

                                    : (
                                        <p>검색 결과가 없습니다.</p>
                                    )}
                            </div>

                        </div>
                    )
                    }


                    {/* 즐겨찾기 동반가능 항목*/}
                    {props.menu === '즐겨찾기' && selectedFavType === '동반가능' && (
                        <div className="search-result-margin">
                            <div style={{ display: "flex" }}>
                                <div className="search-result-count">검색 결과 {accompanyFav.length} 건
                                </div>
                            </div>

                            <div className="search-result-area">
                                {accompanyFav && accompanyFav.length > 0 ? (
                                    accompanyFav.map((item, index) => (
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
                                                        level: 6,
                                                        position: {
                                                            lat: item.mapy,
                                                            lng: item.mapx
                                                        }
                                                    }
                                                )
                                            }}
                                            onMouseEnter={() => setHoveredIndex(index)}  // 마우스 올리기
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        >
                                            <div className="search-result-title">{item.title}</div>
                                            <div className="search-result-content">{item.addr1}</div>
                                        </div>
                                    ))
                                )

                                    : (
                                        <p>검색 결과가 없습니다.</p>
                                    )}
                            </div>

                        </div>
                    )
                    }
                </div >
            </>
        )

    }
    else if (props.menu === '산책기록') {
        return (
            <div className="search-result">
                {props.menu === '산책기록' && (
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