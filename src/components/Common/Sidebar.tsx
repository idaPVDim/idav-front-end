




import React, { useState } from "react";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faTools, faWrench, faBoxes, faCogs, faChevronLeft, faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import logo from "../../images/dimlogo1.png";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Logo and Toggle */}
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-logo">
            <img src={logo} alt="idaPVDim Logo" />
          </div>
        )}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
        </button>
      </div>

      {/* Navigation Links */}
      <ul className="sidebar-links">
        <li>
          <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
          <NavLink
            to="/user-management"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            {!isCollapsed && "Gestion des Utilisateurs"}
          </NavLink>
        </li>
        <li>
          <FontAwesomeIcon icon={faTools} className="sidebar-icon" />
          <NavLink
            to="/installation-maintenance-management"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            {!isCollapsed && "Gestion des Installations & Maintenances"}
          </NavLink>
        </li>
        <li>
          <FontAwesomeIcon icon={faWrench} className="sidebar-icon" />
          <NavLink
            to="/stock-equipment-management"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            {!isCollapsed && "Gestion des Stocks & Équipements"}
          </NavLink>
        </li>
        <li>
          <FontAwesomeIcon icon={faBoxes} className="sidebar-icon" />
          <NavLink
            to="/statistics-dashboard"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            {!isCollapsed && "Statistiques & Historique"}
          </NavLink>
        </li>
        <li>
          <FontAwesomeIcon icon={faCogs} className="sidebar-icon" />
          <NavLink
            to="/security-authentification"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            {!isCollapsed && "Sécurité & Authentification"}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;