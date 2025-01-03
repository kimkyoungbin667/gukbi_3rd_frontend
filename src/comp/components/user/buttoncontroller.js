import { useState } from "react";
import RegisterKakao from "./register_kakao"; // 카카오 컴포넌트
import RegisterEmail from "./register_email"; // 이메일 컴포넌트
import "../../css/user/ButtonControlledContent.css"; // 스타일 파일

export default function ButtonControlledContent() {
    const [activeContent, setActiveContent] = useState("email"); // 기본 콘텐츠를 이메일로 설정

    return (
        <div className="button-controlled-container">
            <h2 className="content-title">회원가입</h2>
            <div className="button-bar">
                <button
                    onClick={() => setActiveContent("email")}
                    className={`content-button ${activeContent === "email" ? "active" : ""}`}
                >
                    이메일 회원가입
                </button>
                <button
                    onClick={() => setActiveContent("kakao")}
                    className={`content-button ${activeContent === "kakao" ? "active" : ""}`}
                >
                    카카오 회원가입
                </button>
            </div>

            <div className="content-area">
                {activeContent === "email" && <RegisterEmail />}
                {activeContent === "kakao" && <RegisterKakao />}
            </div>
        </div>
    );
}
