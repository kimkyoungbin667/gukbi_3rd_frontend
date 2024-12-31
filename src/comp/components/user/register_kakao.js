import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/user";

export default function Register() {
    const [formData, setFormData] = useState({
        userName: "",
        userNickname: "",
        userEmail: "",
        userPassword: "",
        userBirth: "",
        userProfileUrl: "https://i.pinimg.com/736x/df/e3/bf/dfe3bfb04d99e860dbdefaa1a5cb3c71.jpg", // 기본 프로필 URL
        socialType: "",
        kakaoId: "", // 카카오 ID 추가
    });

    const navigate = useNavigate();

    const initializeKakaoSDK = () => {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init("5eb58fa73fc5691112750151fa475971"); // 카카오 앱 키 입력
        }
    };

    const handleKakaoLogin = () => {
        initializeKakaoSDK();
        window.Kakao.Auth.login({
            success: function (authObj) {
                window.Kakao.API.request({
                    url: "/v2/user/me",
                    success: function (response) {
                        const email = response.kakao_account.email;
                        const kakaoId = response.id;
                        if (email) {
                            setFormData({
                                ...formData,
                                userEmail: email,
                                kakaoId: kakaoId,
                                socialType: "kakao",
                            });
                            alert(`카카오 이메일과 ID를 가져왔습니다.\n이메일: ${email}\nID: ${kakaoId}`);
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

        registerUser(formData)
            .then((res) => {
                if (res.data.code === "200") {
                    alert("회원가입 성공!");
                    navigate("/login");
                } else {
                    alert(res.data.message || "회원가입 실패");
                }
            })
            .catch((err) => {
                console.error(err);
                alert("회원가입 중 오류가 발생했습니다.");
            });
    };

    return (
        <div className="register-container">
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>이름:</label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>닉네임:</label>
                    <input
                        type="text"
                        name="userNickname"
                        value={formData.userNickname}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>이메일:</label>
                    <input
                        type="email"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleChange}
                        required
                    />
                    <button type="button" onClick={handleKakaoLogin}>
                        카카오 이메일 가져오기
                    </button>
                </div>
                <div>
                    <label>비밀번호:</label>
                    <input
                        type="password"
                        name="userPassword"
                        value={formData.userPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>생년월일:</label>
                    <input
                        type="date"
                        name="userBirth"
                        value={formData.userBirth}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}
