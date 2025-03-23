import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../images/dimlogo1.png'; // Chemin mis à jour
import UserProfile from './UserProfile';
import SearchBar from './SearchBar';
import Notifications from './Notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faBell } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="idaPVDim Logo" className="navbar-logo" />
      </div>
      <SearchBar />
      <div className="navbar-icons">
        <div className="navbar-icon" onClick={toggleNotifications}>
          <FontAwesomeIcon icon={faBell} /> {/* Notification icon */}
          {showNotifications && <Notifications />}
        </div>
        <div className="navbar-icon" onClick={toggleSettings}>
          <FontAwesomeIcon icon={faCog} /> {/* Settings icon */}
          {showSettings && <div className="settings-dropdown">Settings options here</div>}
        </div>
        <div className="navbar-icon" onClick={toggleProfile}>
          <div className="user-initial">A</div>
          {showProfile && <UserProfile />}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
