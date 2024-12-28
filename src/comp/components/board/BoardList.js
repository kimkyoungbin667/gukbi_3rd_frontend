import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { boardList } from "../../api/board";
import "../../css/board/boardList.css";
import '../../css/cursor/cursor.css';

export default function BoardList() {
    const [boards, setBoards] = useState([]); // 게시글 리스트
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수

    const navigate = useNavigate();

    // 게시글 목록 가져오기
    function getBoardListAction(page) {

        let obj = new Object();
        obj.page = page;

        boardList(obj)
            .then(res => {
                console.log(res.data);
                if (res.data.code === "200") {
                    setBoards(res.data.data);
                    setTotalPages(res.data.totalPages); // 총 페이지 수 설정
                    console.log(boards);
                    console.log(totalPages);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        setCurrentPage(page);
        getBoardListAction(page);
    };

    function moveToDetail(boardIdx) {
        navigate('/boardDetail', { state: { boardIdx: boardIdx } });
    }

    // 컴포넌트 로드 시 데이터 로드
    useEffect(() => {
        getBoardListAction(currentPage);
    }, [currentPage]);

    return (
        <div>
            <div className="table-container">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>추천수</th>
                            <th>조회수</th>
                            <th>작성일</th>
                        </tr>
                    </thead>

                    <tbody>
                        {boards.map((item, index) => (
                            <tr key={index} onClick={() => moveToDetail(item.boardIdx)}>
                                <td>{index + 1 + (currentPage - 1) * 10}</td>
                                <td>{item.title}</td>
                                <td>{item.createdByUserNickname}</td>
                                <td>{item.likeCount}</td>
                                <td>{item.viewCount}</td>
                                <td>{item.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        className={currentPage === index + 1 ? 'active' : ''}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            <input
                type="button"
                value="글쓰기"
                onClick={() => navigate("/boardWrite")}
            />
        </div>
    );
}
