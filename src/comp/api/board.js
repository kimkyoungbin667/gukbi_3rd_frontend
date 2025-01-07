import api from '../ax/axiosSetting'

/**
 * 게시글 리스트 가져오기
 * @param {} param
 * @returns {Promise}
 */
export const getBoardList = (param) => {
    return api.get('/board/getBoardList', {
        params: param
    });
};

/**
 * 게시글 상세보기
 * @param {Object} obj 
 * @param {number} obj.boardIdx - 게시글 idx
 * @return {Promise<Object>}
 */
export const getBoardDetail = (param) => {
    return api.get('/board/readBoardPost', {
        params: param
    });
};

/**
 * 게시글 작성하기
 * @param {Object} obj
 * @param {title} obj.title - 게시글 제목
 * @param {content} obj.content - 게시글 내용
 * @return {Promise}
 */
export const BoardWriteAction = (obj) => {
    return api.post('/board/createBoardPost', JSON.stringify(obj))
}

/**
 * 게시글 수정하기
 * @param {Object} obj
 * @param {number} obj.boardIdx - 게시글 idx
 * @param {string} obj.content - 게시글 내용
 * @return {Promise}
 */
export const saveEditBoard = (obj) => {
    return api.post('/board/updateBoardPost', JSON.stringify(obj))
}

/**
 * 게시글 삭제하기
 * @param {Object} obj
 * @param {number} obj.boardIdx - 게시글 idx
 * @return {Promise}
 */
export const boardDelete = (obj) => {
    return api.post('/board/deleteBoardPost', JSON.stringify(obj))
}


/**
 * 게시글 조회수 올리기
 * @param {Object} obj
 * @param {number} obj.boardIdx - 게시글 idx
 * @return {Promise}
 */
export const increaseView = (obj) => {
    return api.post('/board/increaseView', JSON.stringify(obj))
}




/**
 * 게시글 댓글/대댓글 조회
 * @param {Object} obj
 * @param {number} obj.boardIdx - 게시글 인덱스
 * @return {Promise<Object>} - 댓글/대댓글
 */
export const getBoardComment = (param) => {
    return api.get('/board/readBoardComments', {
        params: param
    });
};

/**
 * 댓글 달기
 * @param {Object} obj
 * @param {number} obj.boardIdx - 게시글 인덱스
 * @return {Promise}
 */
export const writeBoardComment = (obj) => {
    return api.post('/board/createBoardComment', JSON.stringify(obj))
}


/**
 * 대댓글 달기
 * @param {Object} obj
 * @param {number} obj.boardIdx - 게시글 인덱스
 * @return {Promise}
 */
export const writeBoardReply = (obj) => {
    return api.post('/board/createBoardReply', JSON.stringify(obj))
}
