import api from "../ax/axiosSetting";

// 사용자 목록 가져오기
export const fetchUsers = () => {
    return api.get("/admin/users");
};

// 특정 사용자 삭제
export const deleteUser = (userId) => {
    return api.delete(`/admin/users/${userId}`);
};

// 사용자 활성화/비활성화
export const toggleUserStatus = (userId, isActive) => {
    return api.put(`/admin/users/${userId}/status`, { isActive });
};

// 사용자 관리자 권한 변경
export const updateUserRole = (userId, isAdmin) => {
    return api.put(`/admin/users/${userId}/role`, { isAdmin });
};

// 게시글 목록 가져오기
export const fetchPosts = () => {
    return api.get("/admin/posts");
};

// 특정 게시글 삭제
export const deletePost = (postId) => {
    return api.delete(`/admin/posts/${postId}`);
};

export const fetchUserActivity = (userId) => {
    return api.get(`/admin/users/${userId}/activity`);
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

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await api.post("/user/refresh-token", {
                    refreshToken: localStorage.getItem("refreshToken"),
                });
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

export default api;
