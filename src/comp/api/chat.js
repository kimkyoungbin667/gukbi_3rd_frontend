import api from '../ax/axiosSetting'

/**
 * 채팅방 목록 갖고오기
 * @param {} obj 
 * @returns 
 */
export const getChatRoomList = (param) => {
    return api.get('/chat/getChatRoomList', { 
        params: param
    });
}

/**
 * 채팅방 내용 불러오기 (채팅방 상세)
 * @param {} obj 
 * @returns 
 */
export const getChatRoomMsg = (param) => {
    return api.get('/chat/getChatRoomMsg', { 
        params: param
    });
}

