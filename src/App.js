import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './comp/components/general/NavBar.js';
import Router from './Router';
import { AuthProvider } from './AuthContext.js'; // AuthProvider 추가

function App() {
  return (
    <div className="App">
      {/* AuthProvider로 애플리케이션 감싸기 */}
      <AuthProvider>
        <BrowserRouter>
          <Navbar />

          <div className='middle-area'>
          <Router />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
