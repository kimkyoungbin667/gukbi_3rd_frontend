import api from "../ax/axiosSetting"; 

// 회원가입 API 호출
export function registerUser(data) {
  return api.post("/user/register", data); 
}

// 이메일 인증 코드 전송
export const sendVerificationCode = (email) => {
  return api.post("/email/send-code", { email });
};

// 이메일 인증 코드 확인
export const verifyCode = (email, code) => {
  return api.post("/email/verify-code", { email, code });
};

// 로그인 API 호출
export const loginUser = (email, password) => {
  return api.post("/user/login", { email, password }); 
};

// 사용자 정보 가져오기 (JWT 인증 필요)
export const getUserProfile = () => {
  const token = localStorage.getItem("token"); // 저장된 JWT 토큰 가져오기
  return api.get("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
    },
  });
};
