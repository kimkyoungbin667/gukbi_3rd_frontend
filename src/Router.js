import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Board
import BoardList from './comp/components/board/BoardList';
import BoardWrite from './comp/components/board/BoardWrite';
import BoardEdit from './comp/components/board/BoardEdit';
import BoardDetail from './comp/components/board/BoardDetail';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/boardList" element={<BoardList />} />
      <Route path="/boardWrite" element={<BoardWrite />} />
      <Route path="/boardEdit" element={<BoardEdit />} />
      <Route path="/boardDetail" element={<BoardDetail />} />
    </Routes>
  );
}

function Home() {
  return (
    <div>
      <h2>메인 페이지</h2>
    </div>
  );
}

export default Router;
