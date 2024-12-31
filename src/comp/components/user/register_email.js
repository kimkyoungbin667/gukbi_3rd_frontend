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
        userProfileUrl: "https://i.pinimg.com/736x/df/e3/bf/dfe3bfb04d99e860dbdefaa1a5cb3c71.jpg", // 기본 프로필 URL (사용자 입력 불가)
    });

    const navigate = useNavigate();

    // 입력 값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();

        // 기본 프로필 URL을 포함한 데이터 전송
        registerUser(formData)
            .then((res) => {
                if (res.data.code === "200") {
                    alert("회원가입 성공!");
                    navigate("/login"); // 회원가입 후 로그인 페이지로 이동
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
            <h2>이메일 회원가입</h2>
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
