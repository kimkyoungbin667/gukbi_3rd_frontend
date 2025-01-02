import React, { useEffect, useState } from "react";
import { getBoardComment, writeBoardComment, writeBoardReply } from "../../api/board";
import '../../css/board/boardCommentArea.css';

function CommentArea({ boardIdx }) {

    // 서버쪽에서 받은 댓글,대댓글 목록
    const [comments, setComments] = useState([]);
    const [finalComments, setFinalComments] = useState([]);
    const [nowUserIdx, setNowUserIdx] = useState('');

    // 작성 중인 댓글
    const [nowComment, setNowComment] = useState('');

    // 작성 중인 대댓글
    const [nowReply, setNowReply] = useState('');


    // 댓글 불러오기
    useEffect(() => {

        setNowUserIdx(localStorage.getItem("userIdx"));

        // 댓글, 대댓글 불러오기 
        getBoardCommentAction();

    }, [boardIdx]);

    // 댓글, 대댓글 불러오기 메서드
    const getBoardCommentAction = () => {

        if (boardIdx) {

            let obj = new Object();
            obj.boardIdx = boardIdx;

            getBoardComment(obj)
                .then(res => {
                    console.log(res);
                    if (res.data.code === '200') {
                        setComments(res.data.data);
                        console.log(res.data.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }


    useEffect(() => {
        processArr(comments);
        console.log(comments);
    }, [comments])

    // 서버에서 받아온 댓글, 대댓글 목록 처리
    const processArr = (comments) => {
        const commentMap = new Map();
        const addedComment = new Set();

        comments.forEach((comment) => {
            comment.replies = [];
        });

        comments.forEach((comment) => {
            if (comment.parentIdx === null) {
                if (!addedComment.has(comment.commentIdx)) {
                    commentMap.set(comment.commentIdx, comment);
                    addedComment.add(comment.commentIdx);
                }
            } else {
                const parentComment = commentMap.get(comment.parentIdx);
                if (parentComment) {
                    parentComment.replies.push(comment);
                }
            }
        });

        const finalArray = [...commentMap.values()];
        setFinalComments(finalArray);
    };


    // 댓글 쓰기
    const wirteCommentAction = () => {

        if(nowComment.length <= 0) {
            alert("댓글을 입력해주세요!");
            return;
        }

        let obj = new Object();
        obj.authorIdx = nowUserIdx;
        obj.boardIdx = boardIdx;
        obj.comment = nowComment;

        writeBoardComment(obj)
            .then(res => {
                if (res.data.data >= 1) {
                    // 다시 댓글, 대댓글 갖고옴
                    getBoardCommentAction();
                    setNowComment("");
                }

            })
            .catch(err => {
                console.log(err);
            })
    }

    const wirteReplyAction = () => {

    }


    return (
        <div className="comments-container">

            {/* 댓글 작성 공간 */}
            <div className="input-comment">
                <input
                    type="text"
                    placeholder="댓글 쓰기"
                    value={nowComment}
                    onChange={(e) => setNowComment(e.target.value)}
                />

                <input type="button" className="comment-write-btn" value="작성" onClick={wirteCommentAction}></input>
            </div>

            {/* 댓글 목록 */}
            {finalComments.length > 0 &&
                 [...finalComments].reverse().map((comment, commentIndex) => (
                    <div key={commentIndex} className="comment">
                        {/* 프로필과 작성자 이름 */}
                        <div className="user-info">
                            <img
                                src={comment.authorProfileUrl}
                                alt="프로필"
                                className="profile-image"
                            />
                            <span className="author-nickname">{comment.authorNickname}</span>
                        </div>

                        {/* 댓글 내용 */}
                        <div className="comment-content">

                            <div className="comment-comment">
                                <p>{comment.content}</p>
                            </div>

                            {/* 대댓글 조회 공간 */}
                            {comment.replies.length > 0 &&
                                comment.replies.map((reply, replyIndex) => (
                                    <div key={replyIndex} className="reply">
                                        <span>{reply.content}</span>
                                        <span className="authorNickname"> - {reply.authorNickname} 🧑🏻</span>
                                    </div>
                                ))}

                            {/* 대댓글 작성 공간 */}
                            <div className="reply-input-area">
                                <input
                                    type="text"
                                    className="reply-write-area"
                                    placeholder="대댓글 작성"
                                    value={nowReply}
                                    onChange={e => setNowReply(e.target.value)}
                                />
                                <input type="button" className="write-reply-btn" value="작성"></input>
                            </div>

                        </div>
                    </div>
                ))}
        </div>



    );
}

export default CommentArea;
