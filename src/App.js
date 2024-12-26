import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './comp/components/general/NavBar.js';
import Router from './Router';

function App() {
  return (
    <div className="App">
      <Navbar />

      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
