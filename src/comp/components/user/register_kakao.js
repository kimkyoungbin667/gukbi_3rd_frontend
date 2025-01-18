import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser , checkKakaoId } from "../../api/user";
import "../../css/user/RegisterKakao.css"; // 스타일 파일 추가

export default function RegisterKakao() {
    const [formData, setFormData] = useState({
        userName: "",
        userEmail: "",
        userBirth: "",
        userProfileUrl: "https://i.pinimg.com/736x/df/e3/bf/dfe3bfb04d99e860dbdefaa1a5cb3c71.jpg",
        socialType: "",
        kakaoId: "",
    });

    const navigate = useNavigate();

    const initializeKakaoSDK = () => {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init("5eb58fa73fc5691112750151fa475971");
        }
    };

    const handleKakaoLogin = () => {
        initializeKakaoSDK();
        window.Kakao.Auth.login({
            success: function (authObj) {
                window.Kakao.API.request({
                    url: "/v2/user/me",
                    success: async function (response) {
                        const email = response.kakao_account.email;
                        const kakaoId = response.id;
    
                        if (email) {
                            try {
                                // 카카오 ID 중복 확인
                                const res = await checkKakaoId(kakaoId);
                                if (res.isDuplicate) {
                                    alert("이미 회원가입된 사용자입니다. 로그인 페이지로 이동합니다.");
                                    navigate("/login");
                                    return;
                                }
    
                                // 중복이 아닌 경우 상태 업데이트
                                setFormData({
                                    ...formData,
                                    userEmail: email,
                                    kakaoId: kakaoId,
                                    socialType: "kakao",
                                });
                                alert(`카카오 이메일과 ID를 가져왔습니다.\n이메일: ${email}\nID: ${kakaoId}`);
                            } catch (error) {
                                console.error("카카오 ID 중복 확인 실패:", error);
                                alert("카카오 ID 확인 중 오류가 발생했습니다.");
                            }
                        } else {
                            alert("이메일 정보를 가져올 수 없습니다.");
                        }
                    },
                    fail: function (error) {
                        console.error("카카오 사용자 정보 요청 실패:", error);
                        alert("사용자 정보를 가져오는데 실패했습니다.");
                    },
                });
            },
            fail: function (err) {
                console.error("카카오 로그인 실패:", err);
                alert("카카오 로그인이 실패했습니다.");
            },
        });
    };
    

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
            alert("카카오 로그인을 통해 정보를 가져와야 합니다.");
            return;
        }
    
        registerUser(formData)
            .then((res) => {
                console.log("서버 응답:", res);
                if (res.status === 200) {
                    alert(res.data || "회원가입 성공!");
                    navigate("/login");
                } else {
                    alert("회원가입 실패");
                }
            })
            .catch((err) => {
                console.error("오류:", err);
                alert("회원가입 중 오류가 발생했습니다.");
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
                    />
                    <button type="button" onClick={handleKakaoLogin} className="kakao-button">
                        카카오 이메일 가져오기
                    </button>
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
        </div>
    );
}
