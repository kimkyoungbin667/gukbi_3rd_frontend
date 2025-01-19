import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function ProfileNavigation() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center", // 수평 중앙 정렬
                height: "100vh", // 뷰포트 전체 높이
                padding: "20px",
            }}
        >
            {/* 내부 컨테이너 */}
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start", // 상단 정렬
                    gap: "20px", // 사이 간격
                    width: "100%",
                    maxWidth: "1200px", // 최대 너비 제한
                }}
            >
                {/* 왼쪽 내비게이션 바 */}
                <nav
                    style={{
                        width: "250px",
                        backgroundColor: "#f9f9f9",
                        border: "1px solid #ddd",
                        padding: "20px",
                        boxSizing: "border-box",
                        borderRadius: "8px",
                    }}
                >
                    <h3 style={{ marginBottom: "20px" }}>내 프로필</h3>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        <li style={{ marginBottom: "10px" }}>
                            <Link to="/profilenavigation/profile" style={{ textDecoration: "none", color: "#333" }}>
                                프로필 정보
                            </Link>
                            <br />
                        </li>
                        <li style={{ marginBottom: "10px" }}>
                            <Link to="/profilenavigation/change-password" style={{ textDecoration: "none", color: "#333" }}>
                                비밀번호 변경
                            </Link>
                            <br />
                        </li>
                        <li style={{ marginBottom: "10px" }}>
                            <Link to="/profilenavigation/delete-account" style={{ textDecoration: "none", color: "#333" }}>
                                회원 탈퇴
                            </Link>
                            <br />
                        </li>
                    </ul>
                </nav>

                {/* 오른쪽 콘텐츠 */}
                <div
                    style={{
                        width: "100%",
                        maxWidth: "1000px", // 최대 길이 1000px로 제한
                        minWidth: "600px", // 최소 길이 600px로 설정
                        padding: "20px",
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // 약간의 그림자 추가
                    }}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
