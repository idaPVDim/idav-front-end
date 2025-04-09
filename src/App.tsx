import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import { AuthContext } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import UserManagement from "./components/UserManagement/UserManagement";
import InstallationMaintenanceManagement from "./components/InstallationMaintenanceManagement/InstallationMaintenanceManagement";
import StockEquipmentManagement from "./components/StockEquipmentManagement/StockEquipmentManagement";
import StatistiqueConnectionHistory from "./components/StatisticsDashboard/StatisticsDashboard";
import SecurityAuthentication from "./components/SecurityAuthentification/SecurityAuthentification";
import Settings from "./components/Settings/Settings";

function App() {
  const { userRole } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Interface principale avec la Sidebar */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Dashboard>
                <Routes>
                  <Route path="user-management" element={<UserManagement />} />
                  {/* Ajoutez d'autres routes ici si nécessaire */}
                </Routes>
              </Dashboard>
            </PrivateRoute>
          }
        />

        {/* Routes spécifiques pour chaque module */}
        {userRole === "Admin" && (
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            }
          />
        )}
        <Route
          path="/installations"
          element={
            <PrivateRoute>
              <InstallationMaintenanceManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/stock"
          element={
            <PrivateRoute>
              <StockEquipmentManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/statistiques"
          element={
            <PrivateRoute>
              <StatistiqueConnectionHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/securite"
          element={
            <PrivateRoute>
              <SecurityAuthentication />
            </PrivateRoute>
          }
        />
        <Route
          path="/parametres"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        {/* Gestion des redirections */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;