import { useState } from "react";
import RegisterKakao from "./register_kakao"; // 카카오 컴포넌트
import RegisterEmail from "./register_email"; // 이메일 컴포넌트

export default function ButtonControlledContent() {
    const [activeContent, setActiveContent] = useState(""); // 현재 활성화된 콘텐츠 상태

    return (
        <div className="button-controlled-container">
            <div className="button-bar">
                <button
                    onClick={() => setActiveContent("kakao")}
                    className={activeContent === "kakao" ? "active" : ""}
                >
                    카카오
                </button>
                <button
                    onClick={() => setActiveContent("email")}
                    className={activeContent === "email" ? "active" : ""}
                >
                    이메일
                </button>
            </div>

            <div className="content-area">
                {activeContent === "kakao" && <RegisterKakao />}
                {activeContent === "email" && <RegisterEmail />}
                {!activeContent && <p>버튼을 클릭하여 내용을 확인하세요.</p>}
            </div>
        </div>
    );
}
