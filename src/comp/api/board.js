import api from '../ax/axiosSetting'

/**
 * 게시글 리스트 가져오기
 * @param {} param
 * @returns {Promise}
 */
export const boardList = (param) => {
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
export const boardDetail = (param) => {
    return api.get('/board/getBoardDetail', {
        params: param
    });
};