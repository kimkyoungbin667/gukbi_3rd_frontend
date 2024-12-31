import api from '../ax/axiosSetting'

// 회원가입 API 호출
export function registerUser(data) {
    return api.post('/user/register', data); // 백엔드 API URL
}
