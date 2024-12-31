import React from 'react';
import '../../css/general/NavBar.css';
import home_logo from '../../../assets/img/home_logo.png';
import { useNavigate } from "react-router-dom";
import '../../css/cursor/cursor.css';

const Navbar = () => {
    const navigate = useNavigate();

    // 페이지 이동 함수
    const moveTo = (path) => {
        navigate(path); // 페이지 이동
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
                        <li onClick={() => moveTo('/')}>A</li>
                        <li onClick={() => moveTo('/')}>B</li>
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

            {/* 로그인 */}
            <ul className="navbar__item">
                <li onClick={() => moveTo('/login')}>로그인</li>
            </ul>
        </nav>
    );
};

export default Navbar;
