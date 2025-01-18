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

// 카카오 로그인 API 호출
export const kakaoLogin = (accessToken) => {
    if (!accessToken) {
        throw new Error("카카오 Access Token이 없습니다.");
    }
    return api.post("/user/kakao-login", { access_token: accessToken });
};

// 사용자 정보 가져오기 (JWT 인증 필요)
export const getUserProfile = () => {
    return api.get("/user/profile");
};

// 사용자 프로필 업데이트 (JWT 인증 필요)
export const updateUserProfile = (data) => {
    return api.put("/user/profile2", data);
};

// 닉네임 가져오기
export const getUserNickname = () => {
    return api.get("/user/nickname");
};

// 프로필 이미지 업로드
export const uploadProfileImage = (formData) => {
    return api.post("/user/upload/profile-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// 로그아웃 API 호출
export const logoutUser = () => {
    return api.post("/user/logout");
};

// 리프레시 토큰을 사용해 새 액세스 토큰 요청
export const refreshToken = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    return api.post("/user/refresh-token", { refreshToken });
};

// Axios 요청 인터셉터: 모든 요청에 액세스 토큰 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Axios 응답 인터셉터: 액세스 토큰 만료 시 처리
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 액세스 토큰 만료 에러인지 확인
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            
            originalRequest._retry = true;

            try {
                const refreshResponse = await refreshToken();
                const newAccessToken = refreshResponse.data.accessToken;

                // 새 액세스 토큰 저장
                localStorage.setItem("token", newAccessToken);

                // 원래 요청에 새 토큰 추가
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // 원래 요청 재시도
                return api(originalRequest);
            } catch (refreshError) {
                console.error("리프레시 토큰 만료 또는 오류:", refreshError);

                // 로그아웃 처리
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export const changePassword = (data) => {
    return api.put("/user/change-password", data);
};

export const deactivateUser = () => {
    return api.put("/user/deactivate", {});
};

export const checkKakaoId = async (kakaoId) => {
    const response = await api.get(`/user/check-kakao-id`, {
        params: { kakaoId },
    });
    return response.data; // { isDuplicate: true/false }
};


export default api;
