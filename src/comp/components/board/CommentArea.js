import React, { useEffect, useState } from "react";
import { getBoardComment, writeBoardComment, writeBoardReply, commentDelete } from "../../api/board";
import { jwtDecode } from "jwt-decode";
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
    const decodedToken = jwtDecode(token);
    const userIdx = decodedToken.sub;

    // 댓글 불러오기
    useEffect(() => {

        // 댓글, 대댓글 불러오기 
        getBoardCommentAction();

    }, [boardIdx]);

    // 댓글, 대댓글 불러오기 메서드
    const getBoardCommentAction = () => {

        if (boardIdx) {
            getBoardComment({ boardIdx })
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

        const commentData = {
            authorIdx: userIdx,
            boardIdx: boardIdx,
            comment: nowComment
        }

        writeBoardComment(commentData)
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

        const replyData = {
            boardIdx: boardIdx,
            authorIdx: userIdx,
            comment: nowReply[commentIndex],
            parentIdx: commentIndex
        }

        writeBoardReply(replyData)
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
    }

    
        // 댓글,대댓글 삭제
        const deleteComment = (commentIdx) => {
            
            commentDelete({commentIdx})
            .then(res => {
                alert('댓글이 삭제되었습니다');
                getBoardCommentAction();
            })
            .catch(err => {
                console.log(err);
            })
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
                                src={`http://58.74.46.219:33334${comment.authorProfileUrl}`}
                                alt="프로필"
                                className="profile-image"
                            />
                            <span className="author-nickname">{comment.authorNickname}</span>

                            {userIdx == comment.authorIdx && <button type="button" className="delete-comment-btn" onClick={()=>deleteComment(comment.commentIdx)}>삭제</button>}
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
                                        {userIdx == reply.authorIdx && <button type="button" className="delete-reply-btn" onClick={()=>deleteComment(reply.commentIdx)}>삭제</button>}
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
