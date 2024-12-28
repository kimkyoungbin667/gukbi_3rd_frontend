import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { boardList } from '../../api/board';
import '../../css/board/boardList.css';

export default function BoardList() {

    const [boards, setBoards] = useState([]);

    const navigate = useNavigate();

    function getBoardListAction() {

        boardList()
            .then(res => {
                console.log(res);
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
                        {boards.map(
                            (item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{item.title}</td>
                                        <td>{item.createdByUserNickname}</td>
                                        <td>{item.likeCount}</td>
                                        <td>{item.viewCount}</td>
                                        <td>{item.createdAt}</td>
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