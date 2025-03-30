import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../Common/Navbar";
import Sidebar from "../Common/Sidebar";
import Footer from "../Common/Footer";
import UserManagement from "../UserManagement/UserManagement";
import InstallationMaintenanceManagement from "../InstallationMaintenanceManagement/InstallationMaintenanceManagement";
import StockEquipmentManagement from "../StockEquipmentManagement/StockEquipmentManagement";
import StatisticConnexionHistory from "../StatisticConnexionHistory/StatisticConnexionHistory";
import SecurityAuthentication from "../SecurityAuthentication/SecurityAuthentication";
import Reports from "../Reports/Reports";
import Settings from "../Settings/Settings";

const Dashboard: React.FC<{children?: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        {/* Main Content - Ajout du centrage */}
        <div style={{ 
          flex: 1, 
          padding: "20px",
          display: "flex",
          justifyContent: "center", // Centre horizontalement
          alignItems: "flex-start", // Aligne en haut
          marginLeft: "250px" // Aligne avec la sidebar
        }}>
          <div style={{ width: "95%", maxWidth: "1200px" }}> {/* Conteneur pour limiter la largeur */}
            <Routes>
              <Route path="user-management" element={<UserManagement />} />
              <Route path="installation-maintenance-management" element={<InstallationMaintenanceManagement />} />
              <Route path="stock-equipment-management" element={<StockEquipmentManagement />} />
              <Route path="statistic-connexion-history" element={<StatisticConnexionHistory />} />
              <Route path="security-authentication" element={<SecurityAuthentication />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="user-management" />} />
            </Routes>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
