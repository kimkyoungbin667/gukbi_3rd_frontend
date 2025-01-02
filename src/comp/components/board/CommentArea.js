import React, { useEffect, useState } from "react";
import { getBoardComment } from "../../api/board";
import '../../css/board/boardCommentArea.css';

function CommentArea({ boardIdx }) {

    // 서버쪽에서 받은 댓글,대댓글 목록
    const [comments, setComments] = useState([]);
    const [finalComments, setFinalComments] = useState([]);

    // 댓글 불러오기
    useEffect(() => {

        if (boardIdx) {

            let obj = new Object();
            obj.boardIdx = boardIdx;

            getBoardComment(obj)
                .then(res => {
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
            <h2 className="comments-title">댓글 목록</h2>

            <input type="text" placeholder="댓글 쓰기"></input>
            
            {finalComments.length > 0 && finalComments.map((comment, commentIndex) => (
                <div key={commentIndex} className="comment">
                    <span>{commentIndex + 1} 번째 - {comment.content}</span>
                    {comment.replies.length > 0 && comment.replies.map((reply, replyIndex) => (
                        <div key={replyIndex} className="reply">
                            <span className="emoji">😃</span> <span>{reply.content}</span>
                        </div>
                    ))}
                </div>
            ))}

        </div>

    );
}

export default CommentArea;
