import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { JSX } from "react";

import Dashboard from "../components/Dashboard/Dashboard";
import UserManagement from "../components/UserManagement/UserManagement";
import InstallationMaintenanceManagement from "../components/InstallationMaintenanceManagement/InstallationMaintenanceManagement";
import StockEquipmentManagement from "../components/StockEquipmentManagement/StockEquipmentManagement";
import SecurityAuthentification from "../components/SecurityAuthentification/SecurityAuthentification";
import Reports from "../components/Reports/Reports";
import Settings from "../components/Settings/Settings";
import Login from "../components/Auth/Login"; // 🔥 Ajout d'une page Login
import StatisticsDashboard from "../components/StatisticsDashboard/StatisticsDashboard";

// ✅ Route protégée (redirige si non connecté)
const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/user-management" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
      <Route path="/installation-maintenance-management/*" element={<PrivateRoute><InstallationMaintenanceManagement /></PrivateRoute>} />
      <Route path="/stock-equipment-management" element={<PrivateRoute><StockEquipmentManagement /></PrivateRoute>} />
      <Route path="/statistics-dashboard" element={<PrivateRoute><StatisticsDashboard/></PrivateRoute>} />
      <Route path="/security-authentification" element={<PrivateRoute><SecurityAuthentification /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;