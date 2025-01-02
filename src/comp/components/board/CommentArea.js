import React, { useEffect, useState } from "react";
import { getBoardComment } from "../../api/board";
import ReplyArea from "../board/ReplyArea"

function CommentArea({ boardIdx }) {

    // 서버쪽에서 받은 댓글,대댓글 목록
    const [comments, setComments] = useState([]);
    const [finalComments, setFinalComments] = useState([]);
    const [idx, setIdx] = useState(1);

    // 댓글 불러오기
    useEffect(() => {

        if (boardIdx) {

            let obj = new Object();
            obj.boardIdx = boardIdx;

            console.log(obj);
            getBoardComment(obj)
                .then(res => {
                    console.log(res);
                    if (res.data.code === '200') {
                        console.log(res.data.data);
                        setComments(res.data.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [boardIdx]);

    useEffect(() => {
        processComments(comments);
    }, [comments])

    // 댓글, 대댓글 처리
    const processComments = (comments) => {

        const commentMap = new Map();
        const addedCommentIdx = new Set();
        const resultComment = []; // 최종 댓글 리스트

        // replies 배열을 추가해서 Map에 다 넣기
        comments.forEach(comment => {
            // 대댓글 리스트
            comment.replies = [];
            commentMap.set(comment.commentIdx, comment);
        });

        console.log("Map 결과 : ", commentMap);

        console.log('시작:', resultComment);

        comments.forEach(comment => {

            // 댓글 일 때
            if (comment.parentIdx === null) {
                console.log("===== ", comment.parentIdx, "=====");
                console.log("댓글 입니다 ");
                // 추가하지 않았을 때
                if (!addedCommentIdx.has(comment.commentIdx)) {
                    addedCommentIdx.add(comment.commentIdx);
                    resultComment.push(comment);
                }

            } else {

                if (comment.parentIdx === 1) {
                    // 대댓글 일 때
                    console.log("★★★★★★★★★ 대댓글 입니다 ㅎㅎ ★★★★★★★★★");
                    console.log('부모 인덱스 ', comment.parentIdx);
                    console.log('자식 인덱스 ', comment.commentIdx);
                    console.log('댓글 내용: ', comment.content);
                    console.log("★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★");

                    const parentComment = commentMap.get(comment.parentIdx);

                    if (comment.parentIdx === 1) {

                        console.log("○○○○○○ 부모가 있습니다 !! ○○○○○○○");
                        console.log("부모는!!!  --> ", parentComment);
                        parentComment.replies.push(comment);

                        console.log("넣었을때 결과는!!!!! : ", parentComment.replies);
                    }
                }

            }
        })
        
        resultComment.map((item) => {
            console.log(item);
        })
        setFinalComments([...resultComment]);
    };


    useEffect(() => {

        console.log(finalComments);
    }, [finalComments]);



    return (
        <div className="comments-container">
            <h2 className="comments-title">댓글 목록</h2>

            {finalComments.length > 0 && finalComments.map((comment, commentIndex) => {
                return (
                    <div key={commentIndex}>

                        <span>{commentIndex + 1} 번째 - {comment.content}</span>
                        {comment.replies.length > 0 && comment.replies.map((reply, replyIndex) => {
                            return (
                                <div key={replyIndex}>
                                    😃 {reply.content}
                                </div>

                            )
                        })}

                    </div>
                )
            })}
        </div>
    );
}

export default CommentArea;
