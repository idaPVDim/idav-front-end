import React from "react";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faTools, faWrench, faBoxes, faCogs } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import logo from "../../images/dimlogo1.png"; // Assurez-vous que le chemin est correct

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={logo} alt="idaPVDim Logo" style={{ width: "150px" }} />
      </div>

      {/* Liens des fonctionnalités */}
      <ul className="sidebar-links">
        <li>
          <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
          <NavLink to="/user-management" className={({ isActive }) => (isActive ? "active-link" : "")}>
            Gestion des Utilisateurs
          </NavLink>
        </li>
        <li>
          <FontAwesomeIcon icon={faTools} className="sidebar-icon" />
          <NavLink to="/installation-maintenance-management" className={({ isActive }) => (isActive ? "active-link" : "")}>
            Gestion des Installations & des Maintenances
          </NavLink>
        </li>
        <li>
          <FontAwesomeIcon icon={faWrench} className="sidebar-icon" />
          <NavLink to="/stock-equipment-management" className={({ isActive }) => (isActive ? "active-link" : "")}>
            Gestion des Stocks & des Équipements
          </NavLink>
        </li>
        <li>
          <FontAwesomeIcon icon={faBoxes} className="sidebar-icon" />
          <NavLink to="/statistic-connexion-history" className={({ isActive }) => (isActive ? "active-link" : "")}>
            Statistique & Historique de connexion
          </NavLink>
        </li>
        <li>
          <FontAwesomeIcon icon={faCogs} className="sidebar-icon" />
          <NavLink to="/security-authentification" className={({ isActive }) => (isActive ? "active-link" : "")}>
            Sécurité & Authentification
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;