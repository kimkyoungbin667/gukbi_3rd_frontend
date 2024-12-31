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
 * 게시글 상세내역 보기
 * @param {Object} obj 
 * @param {number} obj.boardIdx - 게시글 idx
 * @return {Promise<Object>}
 */
export const getBoardDetail = (param) => {
    return api.get('/board/getBoardDetail', {
        params: param
    });
};

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
 * 게시글 수정하기
 * @param {Object} obj
 * @param {number} obj.boardIdx 
 * @param {string} obj.content 
 * @return {Promise}
 */
export const saveEditBoard = (obj) => {
    return api.post('/board/saveEditBoard', JSON.stringify(obj))
}