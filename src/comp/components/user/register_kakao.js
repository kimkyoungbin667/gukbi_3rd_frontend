import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, checkKakaoId } from "../../api/user";
import AlertBox from "../general/alertbox"; 
import "../../css/user/RegisterKakao.css";

export default function RegisterKakao() {
    const [formData, setFormData] = useState({
        userName: "",
        userEmail: "",
        userBirth: "",
        userProfileUrl: "https://i.pinimg.com/736x/df/e3/bf/dfe3bfb04d99e860dbdefaa1a5cb3c71.jpg",
        socialType: "",
        kakaoId: "",
    });
    const [alertMessage, setAlertMessage] = useState(""); // 알림 메시지 상태
    const navigate = useNavigate();

    useEffect(() => {
        const initializeKakaoSDK = () => {
            if (!window.Kakao.isInitialized()) {
                window.Kakao.init("5eb58fa73fc5691112750151fa475971");
                console.log("Kakao SDK Initialized");
            }
        };

        const handleKakaoLogin = () => {
            window.Kakao.Auth.login({
                success: function (authObj) {
                    window.Kakao.API.request({
                        url: "/v2/user/me",
                        success: async function (response) {
                            const email = response.kakao_account.email;
                            const kakaoId = response.id;

                            if (email) {
                                try {
                                    const res = await checkKakaoId(kakaoId);
                                    if (res.isDuplicate) {
                                        setAlertMessage("이미 회원가입된 사용자입니다. 로그인 페이지로 이동합니다.");
                                        setTimeout(() => navigate("/login"), 2000);
                                        return;
                                    }

                                    setFormData({
                                        ...formData,
                                        userEmail: email,
                                        kakaoId: kakaoId,
                                        socialType: "kakao",
                                    });
                                    setAlertMessage(`카카오 이메일과 ID를 가져왔습니다.\n이메일: ${email}\nID: ${kakaoId}`);
                                } catch (error) {
                                    console.error("카카오 ID 중복 확인 실패:", error);
                                    setAlertMessage("카카오 ID 확인 중 오류가 발생했습니다.");
                                }
                            } else {
                                setAlertMessage("이메일 정보를 가져올 수 없습니다.");
                            }
                        },
                        fail: function (error) {
                            console.error("카카오 사용자 정보 요청 실패:", error);
                            setAlertMessage("사용자 정보를 가져오는데 실패했습니다.");
                        },
                    });
                },
                fail: function (err) {
                    console.error("카카오 로그인 실패:", err);
                    setAlertMessage("카카오 로그인이 실패했습니다.");
                },
            });
        };

        initializeKakaoSDK();
        handleKakaoLogin();
    }, [navigate, formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.kakaoId) {
            setAlertMessage("카카오 로그인을 통해 정보를 가져와야 합니다.");
            return;
        }

        registerUser(formData)
            .then((res) => {
                if (res.status === 200) {
                    setAlertMessage(res.data || "회원가입 성공!");
                    setTimeout(() => navigate("/login"), 2000);
                } else {
                    setAlertMessage("회원가입 실패");
                }
            })
            .catch((err) => {
                console.error("오류:", err);
                setAlertMessage("회원가입 중 오류가 발생했습니다.");
            });
    };

    return (
        <div className="register-container">
            <h2 className="register-title">카카오 회원가입</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label>이메일:</label>
                    <input
                        type="email"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleChange}
                        required
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>이름:</label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>생년월일:</label>
                    <input
                        type="date"
                        name="userBirth"
                        value={formData.userBirth}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="submit-button">회원가입</button>
            </form>

            {/* AlertBox 컴포넌트 */}
            {alertMessage && (
                <AlertBox message={alertMessage} onClose={() => setAlertMessage("")} />
            )}
        </div>
    );
}
