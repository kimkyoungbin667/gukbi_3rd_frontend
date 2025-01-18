import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendVerificationCode, verifyCode, registerUser } from "../../api/user";
import "../../css/user/RegisterEmail.css"; // 스타일 파일

export default function RegisterEmail() {
    const [formData, setFormData] = useState({
        userName: "",
        userEmail: "",
        userPassword: "",
        userBirth: "",
        userProfileUrl: "https://i.pinimg.com/736x/df/e3/bf/dfe3bfb04d99e860dbdefaa1a5cb3c71.jpg", // 기본 프로필 URL
        socialType: "GENERAL",
    });

    const [verificationCode, setVerificationCode] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [passwordConfirm, setPasswordConfirm] = useState(""); // 비밀번호 확인 필드
    const [passwordMatch, setPasswordMatch] = useState(true); // 비밀번호 일치 여부
    const [isEmailValid, setIsEmailValid] = useState(true); // 이메일 유효성 검사 상태
    const [isEmailDuplicate, setIsEmailDuplicate] = useState(false); // 이메일 중복 상태
    const navigate = useNavigate();

    // 이메일 유효성 검사 함수
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "userEmail") {
            setIsEmailValid(isValidEmail(value));
            setIsEmailDuplicate(false); // 이메일 변경 시 중복 상태 초기화
        }

        if (name === "userPassword" || name === "passwordConfirm") {
            checkPasswordMatch(
                name === "userPassword" ? value : formData.userPassword,
                name === "passwordConfirm" ? value : passwordConfirm
            );
        }
    };

    const handlePasswordConfirmChange = (e) => {
        const value = e.target.value;
        setPasswordConfirm(value);
        checkPasswordMatch(formData.userPassword, value);
    };

    const checkPasswordMatch = (password, confirmPassword) => {
        setPasswordMatch(password === confirmPassword);
    };

    const handleSendCode = () => {
        if (!isValidEmail(formData.userEmail)) {
            alert("유효한 이메일 주소를 입력해주세요.");
            return;
        }

        sendVerificationCode(formData.userEmail)
            .then(() => {
                alert("인증 코드가 발송되었습니다.");
                setCodeSent(true);
                setIsEmailDuplicate(false); // 중복 상태 초기화
            })
            .catch((error) => {
                if (error.response && error.response.status === 409) {
                    setIsEmailDuplicate(true); // 이메일 중복 상태 설정
                } else {
                    alert("인증 코드 발송에 실패했습니다. 이메일을 확인하세요.");
                }
            });
    };

    const handleVerifyCode = () => {
        verifyCode(formData.userEmail, verificationCode)
            .then(() => {
                alert("이메일 인증이 완료되었습니다.");
                setIsEmailVerified(true);
            })
            .catch(() => {
                alert("인증 코드가 올바르지 않습니다.");
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isEmailVerified) {
            alert("이메일 인증을 완료해주세요.");
            return;
        }

        if (!passwordMatch) {
            alert("비밀번호가 일치하지 않습니다.");
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
            <h2 className="register-title">이메일 회원가입</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label>이메일:</label>
                    <input
                        type="email"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleChange}
                        required
                        className={isEmailValid && !isEmailDuplicate ? "" : "invalid-input"}
                    />
                    <button
                        type="button"
                        onClick={handleSendCode}
                        disabled={!isEmailValid || codeSent}
                        className="send-code-button"
                    >
                        {codeSent ? "코드 재발송" : "코드 발송"}
                    </button>
                    {!isEmailValid && <p className="error-text">유효한 이메일 주소를 입력해주세요.</p>}
                    {isEmailDuplicate && <p className="error-text">이미 사용 중인 이메일입니다.</p>}
                </div>
                {codeSent && (
                    <div className="form-group">
                        <label>인증 코드:</label>
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                        <button type="button" onClick={handleVerifyCode} className="verify-code-button">
                            인증 확인
                        </button>
                    </div>
                )}
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
                    <label>비밀번호:</label>
                    <input
                        type="password"
                        name="userPassword"
                        value={formData.userPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>비밀번호 확인:</label>
                    <input
                        type="password"
                        value={passwordConfirm}
                        onChange={handlePasswordConfirmChange}
                        required
                    />
                    {!passwordMatch && <p className="error-text">비밀번호가 일치하지 않습니다.</p>}
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
                <button type="submit" className="submit-button" disabled={!isEmailVerified}>
                    회원가입
                </button>
            </form>
        </div>
    );
}
