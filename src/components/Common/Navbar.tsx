import React, { useState, useContext } from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell, faCog, faSignOutAlt, faSun, faMoon,
} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar";
import Notifications from "./Notifications";
import UserProfile from "./UserProfile";
import { AuthContext } from "../../context/AuthContext"; // Assuming you have this
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { logout } = useContext(AuthContext); // Example context
  const user = { username: "DefaultUser" }; // Temporary user object for demonstration
  const navigate = useNavigate();

  const toggleProfile = () => setShowProfile(!showProfile);
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleSettings = () => setShowSettings(!showSettings);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("light-mode", !isDarkMode);
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <SearchBar />
      <div className="navbar-icons">
        <div className="navbar-icon" onClick={toggleTheme}>
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
        </div>
        <div className="navbar-icon" onClick={toggleNotifications}>
          <FontAwesomeIcon icon={faBell} />
          {showNotifications && <Notifications />}
        </div>
        <div className="navbar-icon" onClick={toggleSettings}>
          <FontAwesomeIcon icon={faCog} />
          {showSettings && (
            <div className="settings-dropdown">
              <button onClick={toggleTheme}>
                {isDarkMode ? "Mode Clair" : "Mode Sombre"}
              </button>
              <button onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
              </button>
            </div>
          )}
        </div>
        <div className="navbar-icon" onClick={toggleProfile}>
          <div className="user-initial">{user?.username?.[0] || "A"}</div>
          {showProfile && <UserProfile />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;