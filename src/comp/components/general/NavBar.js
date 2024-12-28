import React, { useState } from 'react';
import '../../css/general/NavBar.css';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom'; 
import home_logo from '../../../assets/img/home_logo.png';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // 토글 버튼 클릭 시 메뉴 열기/닫기
    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    // 해당 페이지로 이동
    const moveTo = (path) => {
        closeMenu();
        console.log(path);
        navigate(path);
    }
    
    // 메뉴 닫기
    const closeMenu = () => {
        console.log('메뉴 닫기');
        setIsOpen(false);
        console.log(isOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar__logo">
                <img src={home_logo} alt="Pet Logo" className="navbar__icon" />
            </div>

            <ul className={`navbar__menu ${isOpen ? 'active' : ''}`}>
                <li className="navbar__item">
                    <RouterLink to="/" onClick={() => moveTo("/")}>홈</RouterLink>
                </li>
                <li className="navbar__item dropdown">
                    <RouterLink to="hot-deals" onClick={closeMenu}>커뮤니티</RouterLink>
                    <ul className="dropdown__menu">
                        <li><RouterLink to="/boardList" onClick={closeMenu}>게시판</RouterLink></li>
                        <li><RouterLink to="/chatList" onClick={closeMenu}>채팅</RouterLink></li>
                    </ul>
                </li>
                <li className="navbar__item dropdown">
                    <RouterLink to="forum" onClick={closeMenu}>성열안</RouterLink>
                    <ul className="dropdown__menu">
                    <li><RouterLink  to="/" onClick={() => moveTo('/')}>A</RouterLink></li>
                    <li><RouterLink  to="/" onClick={() => moveTo('/')}>B</RouterLink></li>
                    </ul>
                </li>
                <li className="navbar__item dropdown">
                    <RouterLink to="faq" onClick={closeMenu}>엄태규</RouterLink>
                    <ul className="dropdown__menu">
                    <li><RouterLink  to="/" onClick={() => moveTo('/')}>A</RouterLink></li>
                    <li><RouterLink  to="/" onClick={() => moveTo('/')}>B</RouterLink></li>
                    </ul>
                </li>
            </ul>

            <ul  className="navbar__item">
            <RouterLink to="jobs" smooth={true} duration={500} onClick={closeMenu}>로그인</RouterLink>
            </ul>


            <div className="navbar__toggleBtn" onClick={handleToggle}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </div>
        </nav>
    );
};

export default Navbar;
