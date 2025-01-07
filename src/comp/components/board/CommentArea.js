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
    const [nowReply, setNowReply] = useState({});

    const token = localStorage.getItem("token");

    // 댓글 불러오기
    useEffect(() => {

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
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    useEffect(() => {
        processArr(comments);
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

        if (nowComment.length <= 0) {
            alert("댓글을 입력해주세요!");
            return;
        }

        let obj = new Object();
        obj.authorToken = token;
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

    // 댓글 삭제
    const deleteCommentAction = () => {

    }

    // 각 위치별 대댓글 관리
    const handleNowReply = (commentIndex, reply) => {

        setNowReply({
            ...nowReply,
            [commentIndex]: reply,
        });
    }

    // 대댓글 쓰기
    const wirteReplyAction = (commentIndex) => {
        if (nowReply.length <= 0) {
            alert("대댓글을 입력해주세요!");
            return;
        }

        let obj = new Object();
        obj.authorToken = token;
        obj.boardIdx = boardIdx;
        obj.comment = nowReply[commentIndex];
        obj.parentIdx = commentIndex;

        console.log(obj);
        writeBoardReply(obj)
            .then(res => {
                if (res.data.data >= 1) {

                    // 다시 댓글, 대댓글 갖고옴
                    getBoardCommentAction();

                    setNowReply({
                        ...nowReply,
                        [commentIndex]: "",
                    });
                }

            })
            .catch(err => {
                console.log(err);
            })

        // 대댓글 삭제
        const deleteReplyAction = () => {
            
        }
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

                            {comment.authorToken === token && <button type="button" className="delete-comment-btn" onClick={deleteCommentAction}>삭제</button>}
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
                                        {reply.authorIdx === Number(nowUserIdx) && <button type="button" className="delete-reply-btn" onClick={deleteCommentAction}>삭제</button>}
                                    </div>
                                ))}

                            {/* 대댓글 작성 공간 */}
                            <div className="reply-input-area">
                                <input
                                    type="text"
                                    className="reply-write-area"
                                    placeholder="대댓글 작성"
                                    value={nowReply[comment.commentIdx]}
                                    onChange={(e) => handleNowReply(comment.commentIdx, e.target.value)}
                                />
                                <input type="button" className="write-reply-btn" value="작성" onClick={() => wirteReplyAction(comment.commentIdx)}></input>
                            </div>
                        </div>
                    </div>
                ))}
        </div>



    );
}

export default CommentArea;
