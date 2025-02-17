import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const showSidebar = location.pathname === '/'; // Adjust the condition as needed

  return (
    <div style={{ display: 'flex' }}>
      {showSidebar && <Sidebar />}
      <div style={{ 
        flex: 1, 
        marginLeft: showSidebar ? '250px' : '0',
        paddingTop: '0px' // Remove padding that might push content down
      }}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
