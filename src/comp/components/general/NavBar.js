// src/components/Navbar.js
import React, { useState } from 'react';
import '../../css/general/NavBar.css';
import { FaFacebookSquare, FaInstagram, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-scroll';
import home_logo from '../../../assets/home_logo.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // 토글 버튼 클릭 시 메뉴 열기/닫기
    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    // 메뉴 항목 클릭 시 메뉴 닫기
    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar__logo">
                <img src={home_logo} alt="Pet Logo" className="navbar__icon" />
            </div>

            <ul className={`navbar__menu ${isOpen ? 'active' : ''}`}>
                <li className="navbar__item">
                    <Link to="home" smooth={true} duration={500} onClick={closeMenu}>홈</Link>
                </li>
                <li className="navbar__item dropdown">
                    <Link to="hot-deals" smooth={true} duration={500} onClick={closeMenu}>커뮤니케이션</Link>
                    <ul className="dropdown__menu">
                        <li><Link to="deal1" smooth={true} duration={500} onClick={closeMenu}>게시판</Link></li>
                        <li><Link to="deal2" smooth={true} duration={500} onClick={closeMenu}>채팅</Link></li>
                    </ul>
                </li>
                <li className="navbar__item dropdown">
                    <Link to="forum" smooth={true} duration={500} onClick={closeMenu}>성열안</Link>
                    <ul className="dropdown__menu">
                        <li><Link to="topic1" smooth={true} duration={500} onClick={closeMenu}>보기 1</Link></li>
                        <li><Link to="topic2" smooth={true} duration={500} onClick={closeMenu}>보기 2</Link></li>
                        <li><Link to="topic3" smooth={true} duration={500} onClick={closeMenu}>보기 3</Link></li>
                    </ul>
                </li>
                <li className="navbar__item dropdown">
                    <Link to="faq" smooth={true} duration={500} onClick={closeMenu}>엄태규</Link>
                    <ul className="dropdown__menu">
                        <li><Link to="topic1" smooth={true} duration={500} onClick={closeMenu}>보기 1</Link></li>
                        <li><Link to="topic2" smooth={true} duration={500} onClick={closeMenu}>보기 2</Link></li>
                        <li><Link to="topic3" smooth={true} duration={500} onClick={closeMenu}>보기 3</Link></li>
                    </ul>
                </li>
            </ul>

            <ul  className="navbar__item">
            <Link to="jobs" smooth={true} duration={500} onClick={closeMenu}>로그인</Link>
            </ul>


            <div className="navbar__toggleBtn" onClick={handleToggle}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </div>
        </nav>
    );
};

export default Navbar;
