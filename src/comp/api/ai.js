
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


/**
 * 특정 반려동물의 정보 가져오기
 * @param {} param
 * @returns {Promise}
 */
export const getAnimalDetail = (obj) => {
    return api.post('/ai/getAnimalDetail', JSON.stringify(obj))
}

/**
 * 특정 반려동물의 정보 가져오기
 * @param {} param
 * @returns {Promise}
 */
export const getAiSolution = (obj) => {
    return api.post('/ai/chat/solution', JSON.stringify(obj))
}
