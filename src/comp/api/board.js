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
