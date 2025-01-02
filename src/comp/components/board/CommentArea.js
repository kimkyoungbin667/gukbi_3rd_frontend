import React, { useEffect, useState } from "react";
import { getBoardComment } from "../../api/board";
import '../../css/board/boardCommentArea.css';

function CommentArea({ boardIdx }) {

    // 서버쪽에서 받은 댓글,대댓글 목록
    const [comments, setComments] = useState([]);
    const [finalComments, setFinalComments] = useState([]);
    const [nowComment, setNowComment] = useState('');

    // 댓글 불러오기
    useEffect(() => {

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

    }, [boardIdx]);

    useEffect(() => {

        processArr(comments);
    }, [comments])

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

                <input type="button" className="comment-write-btn" value="작성"></input>
            </div>

            {/* 댓글 목록 */}
            {finalComments.length > 0 &&
                finalComments.map((comment, commentIndex) => (
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
