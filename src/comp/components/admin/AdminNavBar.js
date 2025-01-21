import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminLogo from '../../../assets/img/bbab.png'; // 관리자 로고 이미지 경로
import '../../css/admin/AdminNavBar.css'; // 관리자 내비게이션 바 스타일
import { useAuth } from '../../../AuthContext'; // useAuth 훅 가져오기
import { logoutUser } from "../../api/user"; // 로그아웃 API 호출 함수

const AdminNavBar = () => {
  const { setIsLoggedIn } = useAuth(); // 로그인 상태 업데이트
  const navigate = useNavigate();

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
        {/* 로그아웃 버튼 추가 */}
        <li onClick={handleLogout} className="admin-navbar__link">Logout</li>
      </ul>
    </nav>
  );
};

export default AdminNavBar;
