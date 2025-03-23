import React from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTools, faWrench, faBoxes, faCogs } from '@fortawesome/free-solid-svg-icons';

type SidebarProps = {
  setActiveSection: (section: string) => void;
};

function Sidebar({ setActiveSection } : SidebarProps) {
  return (
    <div className="sidebar">
      <ul className="sidebar-links">
        <li onClick={() => setActiveSection('user-management')}>
          <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
          <a href="#user-management">Gestion des utilisateurs</a>
        </li>
        <li onClick={() => setActiveSection('installation-maintenance-management')}>
          <FontAwesomeIcon icon={faTools} className="sidebar-icon" />
          <a href="#installation-maintenance-management">Suivi des installations et des maintenances</a>
        </li>
        <li onClick={() => setActiveSection('stock-equipment-management')}>
          <FontAwesomeIcon icon={faWrench} className="sidebar-icon" />
          <a href="#stock-equipment-management">Gestion des stocks et équipements</a>
        </li>
        <li onClick={() => setActiveSection('connection-history')}>
          <FontAwesomeIcon icon={faBoxes} className="sidebar-icon" />
          <a href="#connection-history">Historique de connexion</a>
        </li>
        <li onClick={() => setActiveSection('security-authentication')}>
          <FontAwesomeIcon icon={faCogs} className="sidebar-icon" />
          <a href="#security-authentication">Sécurité et authentification</a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
