import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InstallationManagement from './InstallationManagement';
import MaintenanceManagement from './MaintenanceManagement';

const InstallationMaintenanceManagement: React.FC = () => {
  return (
    <Routes>
      <Route path="installation-management" element={<InstallationManagement />} />
      <Route path="maintenance-management" element={<MaintenanceManagement />} />
    </Routes>
  );
};

export default InstallationMaintenanceManagement;
