import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Main
import Main from './comp/components/general/Main';

// Board
import BoardList from './comp/components/board/BoardList';
import BoardWrite from './comp/components/board/BoardWrite';
import BoardEdit from './comp/components/board/BoardEdit';
import BoardDetail from './comp/components/board/BoardDetail';

// Test
import Test from './comp/components/board/Test';

// Chat
import ChatList from './comp/components/chat/ChatList';
import KakaoMap from './comp/components/map/KakaoMap';

// User
import RegisterEmail from './comp/components/user/register_email'
import RegisterKakao from './comp/components/user/register_kakao'
import Buttoncontroller from './comp/components/user/buttoncontroller'
import Login from './comp/components/user/login'
import ProfileSetup from './comp/components/user/profile_setup'
import ProfileNavigation from './comp/components/user/ProfileNavigation';
import Profile from './comp/components/user/user_profile'
import PasswordChange from './comp/components/user/passwordchange';
import AccountDeactivation from './comp/components/user/accountdeactivation';

// Pet
import PetRegistration from './comp/components/pet/pet_registration'
import MyPetsPage from './comp/components/pet/mypetspage'

// AI
import AiChat from './comp/components/ai/AiChat'
import AiSolution from './comp/components/ai/AiSolution'


function Router() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />

      {/* board */}
      <Route path="/boardList" element={<BoardList />} />
      <Route path="/boardWrite" element={<BoardWrite />} />
      <Route path="/boardEdit" element={<BoardEdit />} />
      <Route path="/boardDetail" element={<BoardDetail />} />

      {/* test */}
      <Route path="/test" element={<Test />} />

      {/* chat */}
      <Route path="/chatList" element={<ChatList />} />

      {/* user */}
      <Route path="/registeremail" element={<RegisterEmail />} />
      <Route path="/registerkakao" element={<RegisterKakao />} />
      <Route path="/registerbutton" element={<Buttoncontroller />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profilesetup" element={<ProfileSetup />} />
      <Route path="profilenavigation/*" element={<ProfileNavigation />}>
      <Route path="profile" element={<Profile />} />
      <Route path="change-password" element={<PasswordChange />} />
      <Route path="delete-account" element={<AccountDeactivation />} />
      </Route>

      {/* map */}
      <Route path="/map" element={<KakaoMap />}></Route>

      {/* pet */}
      <Route path="/petregistration" element={<PetRegistration />} />
      <Route path="/mypetspage" element={<MyPetsPage />} />

      {/* ai */}
      <Route path="/aiChat" element={<AiChat />} />
      <Route path="/aiSolution" element={<AiSolution />} />

    </Routes>
  );
}


export default Router;

