
import api from '../ax/axiosSetting'

/**
 * 게시글 리스트 가져오기
 * @param {} param
 * @returns {Promise}
 */
export const getAnimalList = (param) => {
    return api.get('/ai/getAnimalList', {
        params: param
    });
};
