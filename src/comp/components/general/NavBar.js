import React, { useState, useEffect } from 'react';
import '../../css/general/NavBar.css';
import home_logo from '../../../assets/img/bbab.png';
import { useLocation, useNavigate } from "react-router-dom";
import '../../css/cursor/cursor.css';
import { logoutUser } from "../../api/user"; // 로그아웃 API 호출 함수
import { useAuth } from '../../../AuthContext'; // AuthContext 가져오기

const Navbar = () => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useAuth(); // useAuth에서 객체 구조 분해로 상태 가져오기

    const location = useLocation();

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

    // 기본 상태
    const [menuText, setMenuText] = useState({
        board: "♧",
        chat: "♧",
        map: "♧",
        aiChat: "♧",
        aiSolution: "♧",
        mypage: "♧",
    });

    // 호버 될때
    const handleMouseEnter = (key) => {
        const hoverTexts = {
            board: " † ",
            chat: "†",
            map: "†",
            aiChat: "†",
            aiSolution: "†",
            mypage: "†",
        };
        setMenuText((prev) => ({ ...prev, [key]: hoverTexts[key] }));
    };

    const handleMouseLeave = (key) => {
        const defaultTexts = {
            board: "♧",
            chat: "♧",
            map: "♧",
            aiChat: "♧",
            aiSolution: "♧",
            mypage: "♧",
        };
        setMenuText((prev) => ({ ...prev, [key]: defaultTexts[key] }));
    };

    return (

        <div>
            <nav className="navbar">

                <div className="navbar__logo">
                    <img src={home_logo} alt="Pet Logo" className="navbar__icon" onClick={() => moveTo('/')} />
                </div>

                {/* 네비게이션 메뉴 */}
                <ul className="navbar__menu">

                    <li className="navbar__item dropdown" onClick={() => moveTo("/boardList")}
                        onMouseEnter={() => handleMouseEnter("board")}
                        onMouseLeave={() => handleMouseLeave("board")}>
                        <div className="navbar__link">{location.pathname == "/boardList" ? " † " : menuText.board}</div>
                        <p className="navbar-text">게시판</p>
                    </li>

                    <li className="navbar__item dropdown" onClick={() => moveTo("/chatList")}
                        onMouseEnter={() => handleMouseEnter("chat")}
                        onMouseLeave={() => handleMouseLeave("chat")}>
                        <div className="navbar__link">{location.pathname == "/chatList" ? " † " : menuText.chat}</div>
                        <p className="navbar-text">채팅</p>
                    </li>

                    <li className="navbar__item dropdown" onClick={() => moveTo("/map")}
                        onMouseEnter={() => handleMouseEnter("map")}
                        onMouseLeave={() => handleMouseLeave("map")}>
                        <div className="navbar__link">{location.pathname == "/map" ? " † " : menuText.map}</div>
                        <p className="navbar-text">지도</p>
                    </li>

                    <li className="navbar__item dropdown" onClick={() => moveTo("/aiChat")}
                        onMouseEnter={() => handleMouseEnter("aiChat")}
                        onMouseLeave={() => handleMouseLeave("aiChat")}>
                        <div className="navbar__link">{location.pathname == "/aiChat" ? " † " : menuText.aiChat}</div>
                        <p className="navbar-text">AI 채팅</p>
                    </li>

                    <li className="navbar__item dropdown" onClick={() => moveTo("/aiSolution")}
                        onMouseEnter={() => handleMouseEnter("aiSolution")}
                        onMouseLeave={() => handleMouseLeave("aiSolution")}>
                        <div className="navbar__link">{location.pathname == "/aiSolution" ? " † " : menuText.mypage}</div>
                        <p className="navbar-text">솔루션</p>
                    </li>

                    {/* /admin/dashboard */}
                    <li className="navbar__item dropdown" onClick={() => moveTo("/mypetspage")}
                        onMouseEnter={() => handleMouseEnter("mypage")}
                        onMouseLeave={() => handleMouseLeave("mypage")}>
                        <div className="navbar__link">{location.pathname == "/567" ? " † " : menuText.mypage}</div>
                        <p className="navbar-text">기술스택</p>
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


        </div>
    );
};

export default Navbar;
