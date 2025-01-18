import './App.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Navbar from './comp/components/general/NavBar.js';
import AdminNavbar from './comp/components/admin/AdminNavBar.js'; // 관리자용 NavBar
import Router from './Router';
import { AuthProvider } from './AuthContext.js';

const App = () => {
  return (
    <div className="App">
      {/* AuthProvider로 애플리케이션 감싸기 */}
      <AuthProvider>
        <BrowserRouter>
          <div className="middle-area">
            <ConditionalNavbar />
            <Router />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

// ConditionalNavbar 컴포넌트 추가
const ConditionalNavbar = () => {
  const location = useLocation();

  // /admin 경로에서만 AdminNavbar를 렌더링
  if (location.pathname.startsWith('/admin')) {
    return <AdminNavbar />;
  }

  // 그 외의 경로에서는 일반 Navbar를 렌더링
  return <Navbar />;
};

export default App;
