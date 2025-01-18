import api from "../ax/axiosSetting";

// 일정 추가 API
export const saveEvent = (eventData) => {
    console.log("요청 데이터:", eventData); // 디버깅용 데이터 확인
    return api.post("/calendar/events", eventData)
        .then((response) => {
            console.log("서버 응답:", response);
            return response;
        })
        .catch((error) => {
            console.error("API 요청 실패:", error.response || error);
            throw error;
        });
};


// 일정 조회 API
export const getEvents = (userId) => {
    return api.get(`/calendar/events`, {
        params: { userId },
    });
};

// 일정 삭제 API
export const deleteEvent = (eventId) => {
    return api.delete(`/calendar/events/${eventId}`);
};

// 일정 수정 API
export const updateEvent = (eventId, updatedEvent) => {
    return api.put(`/calendar/events/${eventId}`, updatedEvent);
};

export const handleKakaoCallback = (authorizationCode) => {
    console.log("전달되는 카카오 OAuth 코드:", authorizationCode); // 인증 코드 로그 출력
    return api.post("/calendar/oauth/callback", { code: authorizationCode })
        .then((response) => {
            console.log("카카오 동의 처리 응답 데이터:", response.data); // 서버 응답 로그 출력
            return response.data;
        })
        .catch((error) => {
            if (error.response) {
                console.error("카카오 동의 처리 실패 - 상태코드:", error.response.status);
                console.error("카카오 동의 처리 실패 - 응답 데이터:", error.response.data);
            } else {
                console.error("카카오 동의 처리 실패 - 요청 자체 실패:", error);
            }
            throw error;
        });
};


// Axios 요청 인터셉터: 모든 요청에 액세스 토큰 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        console.log("API 요청 - 사용 중인 토큰:", token);
        console.log("API 요청 - 엔드포인트:", config.url);
        console.log("API 요청 - 데이터:", config.data);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("API 요청 인터셉터 오류:", error);
        return Promise.reject(error);
    }
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
