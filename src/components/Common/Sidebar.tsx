import React from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTools, faWrench, faBoxes, faCogs } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-links">
        <li>
          <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
          <Link to="/user-management">Gestion des Utilisateurs</Link>
        </li>
        <li>
          <FontAwesomeIcon icon={faTools} className="sidebar-icon" />
          <Link to="/installation-maintenance-management">Gestion des Installations & des Maintenances</Link>
        </li>
        <li>
          <FontAwesomeIcon icon={faWrench} className="sidebar-icon" />
          <Link to="/stock-equipment-management">Gestion des Stocks & des Equipements</Link>
        </li>
        <li>
          <FontAwesomeIcon icon={faBoxes} className="sidebar-icon" />
          <Link to="/reports">Statistique & Historique de connexion</Link>
        </li>
        <li>
          <FontAwesomeIcon icon={faCogs} className="sidebar-icon" />
          <Link to="/settings">Sécurité & Authentification</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;