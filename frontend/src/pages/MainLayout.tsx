import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

type NavTab = 'home' | 'schedule' | 'chat' | 'profile';

const MainLayout = () => {
  const location = useLocation();

  const getActiveTab = (): NavTab => {
    if (location.pathname.startsWith('/schedule')) return 'schedule';
    if (location.pathname.startsWith('/chat')) return 'chat';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return 'home';
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 relative">     
      <div className="h-full w-full overflow-y-auto pb-24">
        <Outlet />
      </div>
      <BottomNav active={getActiveTab()} />
    </div>
  );
};

export default MainLayout;
