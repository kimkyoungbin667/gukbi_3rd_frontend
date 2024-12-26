import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { boardList } from '../../api/board/board';
import '../../css/board/boardList.css';

export default function BoardList() {

    const [boards, setBoards] = useState([]);

    const navigate = useNavigate();

    function getBoardListAction() {

        boardList()
            .then(res => {
                if(res.data.code == '200') {
                    console.log(res.data.data);
                    setBoards(res.data.data);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        getBoardListAction();
    }, [])

    return (
        <div>
            <h1>게시글 목록 페이지</h1>

            <div className="table-container">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>제목</th>
                            <th>추천수</th>
                            <th>작성자</th>
                            <th>생성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boards.map(
                            (item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.title}</td>
                                        <td>❤️ {item.good}</td>
                                        <td>{item.userName}</td>
                                        <td>{item.created}</td>
                                    </tr>
                                )

                            }
                        )}
                    </tbody>
                </table>
            </div>

            <input type='button' value='글쓰기' onClick={() => navigate("/boardWrite")} />
        </div >
    )
}