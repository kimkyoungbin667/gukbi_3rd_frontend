import React, { useEffect } from 'react';
import '../../css/general/NavBar.css';
import home_logo from '../../../assets/img/home_logo.png';
import { useNavigate } from "react-router-dom";
import '../../css/cursor/cursor.css';
import { logoutUser } from "../../api/user"; // 로그아웃 API 호출 함수
import { useAuth } from '../../../AuthContext'; // AuthContext 가져오기

const Navbar = () => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useAuth(); // useAuth에서 객체 구조 분해로 상태 가져오기

    // 로그인 상태 확인
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // 토큰이 있으면 로그인 상태로 설정
    }, [setIsLoggedIn]);

    // 페이지 이동 함수
    const moveTo = (path) => {
        navigate(path); // 페이지 이동
    };

    // 로그아웃 처리
    const handleLogout = async () => {
        try {
            // 서버에 로그아웃 요청
            await logoutUser();

            // 클라이언트의 로컬 스토리지에서 토큰 삭제
            localStorage.removeItem("token"); // 액세스 토큰 삭제
            localStorage.removeItem("refreshToken"); // 리프레시 토큰 삭제
            setIsLoggedIn(false); // 상태 업데이트
            alert("로그아웃 되었습니다.");
            navigate("/"); // 메인 페이지로 이동
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
            alert("로그아웃 실패");
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar__logo">
                <img src={home_logo} alt="Pet Logo" className="navbar__icon" onClick={() => moveTo('/')} />
            </div>

            {/* 네비게이션 메뉴 */}
            <ul className="navbar__menu">
                <li className="navbar__item dropdown">
                    <div className="navbar__link">커뮤니티</div>
                    <ul className="dropdown__menu">
                        <li onClick={() => moveTo('/boardList')}>게시판</li>
                        <li onClick={() => moveTo('/chatList')}>채팅</li>
                    </ul>
                </li>
                <li className="navbar__item dropdown">
                    <div className="navbar__link">성열안</div>
                    <ul className="dropdown__menu">
                        <li onClick={() => moveTo('/profilenavigation')}>사용자 프로필</li>
                        <li onClick={() => moveTo('/petregistration')}>동물 입력</li>
                        <li onClick={() => moveTo('/mypetspage')}>내 반려동물</li>
                    </ul>
                </li>
                <li className="navbar__item dropdown">
                    <div className="navbar__link">엄태규</div>
                    <ul className="dropdown__menu">
                        <li onClick={() => moveTo('/map')}>Map</li>
                        <li onClick={() => moveTo('/')}>B</li>
                    </ul>
                </li>
                <li className="navbar__item dropdown">
                    <div className="navbar__link">윤수현</div>
                    <ul className="dropdown__menu">
                        <li onClick={() => moveTo('/')}>A</li>
                        <li onClick={() => moveTo('/')}>B</li>
                    </ul>
                </li>
            </ul>

            {/* 로그인/로그아웃 */}
            <ul className="navbar__item">
                {isLoggedIn ? (
                    <li onClick={handleLogout}>로그아웃</li>
                ) : (
                    <li onClick={() => moveTo('/login')}>로그인</li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
