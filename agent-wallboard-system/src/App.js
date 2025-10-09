// App.js
import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import UserManagementPage from './pages/UserManagementPage';
import { authAPI } from './services/authAPI';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authAPI.isLoggedIn());

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsLoggedIn(false);
  };

  return React.createElement('div', { className: 'App' },
    isLoggedIn ? 
      React.createElement(UserManagementPage, { onLogout: handleLogout }) :
      React.createElement(LoginPage, { onLoginSuccess: handleLoginSuccess })
  );
}

export default App;