import React from 'react';
import { Link } from 'react-router-dom';
import adminLogo from '../../../assets/img/logo2.png'; // 관리자 로고 이미지 경로
import '../../css/admin/AdminNavBar.css'; // 관리자 내비게이션 바 스타일

const AdminNavBar = () => {
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar__logo">
        <img src={adminLogo} alt="Admin Logo" className="admin-navbar__icon" />
      </div>
      <ul className="admin-navbar__menu">
        <li>
          <Link to="/admin/users" className="admin-navbar__link">사용자 관리</Link>
        </li>
        <li>
          <Link to="/admin/boards" className="admin-navbar__link">콘텐츠 관리</Link>
        </li>
        <li>
          <Link to="/logout" className="admin-navbar__link">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavBar;
