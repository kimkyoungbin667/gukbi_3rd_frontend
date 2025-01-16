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
export const getBoardDetail = (obj) => {
    return api.post('/board/readBoardPost', JSON.stringify(obj))
}

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
 * 게시글 댓글,대댓글 삭제하기
 * @param {Object} obj
 * @param {number} obj.commentIdx - 댓글 idx
 * @return {Promise}
 */
export const commentDelete = (obj) => {
    return api.post('/board/deleteBoardPostComment', JSON.stringify(obj))
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

/**
 * 좋아요 +1 하기
 * @param {Object} obj
 * @param {number} obj.boardIdx - 게시글 인덱스
 * @return {Promise}
 */
export const upBoardPostLike = (obj) => {
    return api.post('/board/upBoardPostLike', JSON.stringify(obj))
}

/**
 * 장소 불러오기 (즐겨찾기 장소 or 산책 경로)
 * @param {Object} obj
 * @param {number} obj.kind - 불러올 종류
 * @return {Promise}
 */
export const getLikeLocation = (param) => {
    return api.get('/board/getLikeLocation', {
        params: param
    });
};

/**
 * 특정 산책경로 불러오기
 * @param {Object} obj
 * @param {number} obj.logId - 산책 경로 아이디
 * @return {Promise}
 */
export const getMapByPath = (obj) => {
    return api.post('/board/getMapByPath', JSON.stringify(obj))
}