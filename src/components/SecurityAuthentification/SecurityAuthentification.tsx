import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import usePagination from "../../hooks/usePagination";
import "./SecurityAuthentification.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faDownload, faSync, faLock, faUnlock, faKey, faShieldAlt, faPlus,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

interface AuthLog {
  id: number;
  user: string;
  action: "Login" | "Logout" | "Failed Login";
  timestamp: string;
  ip_address: string;
}

interface SecuritySetting {
  id: number;
  name: string;
  value: string | boolean;
  description: string;
}

const SecurityAuthentication: React.FC = () => {
  const { userRole, logout } = useContext(AuthContext);
  const [authLogs, setAuthLogs] = useState<AuthLog[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([]);
  const [newSetting, setNewSetting] = useState({ name: "", value: "", description: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof AuthLog>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30); // Default: 30 minutes

  const filteredLogs = authLogs
    .filter((log) =>
      Object.values(log).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const { paginatedData, currentPage, totalPages, nextPage, prevPage } = usePagination(filteredLogs, 5);

  useEffect(() => {
    fetchAuthLogs();
    fetchSecuritySettings();
  }, []);

  const fetchAuthLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<AuthLog[]>("http://127.0.0.1:8000/api/auth-logs/");
      setAuthLogs(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des logs", err);
      setError("Impossible de charger les logs d'authentification. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSecuritySettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get<SecuritySetting[]>("http://127.0.0.1:8000/api/security-settings/");
      setSecuritySettings(response.data);
      const twoFactor = response.data.find((s) => s.name === "TwoFactorAuth")?.value;
      const timeout = response.data.find((s) => s.name === "SessionTimeout")?.value;
      setTwoFactorEnabled(twoFactor === "true" || twoFactor === true);
      setSessionTimeout(parseInt(timeout as string) || 30);
    } catch (err) {
      console.error("Erreur lors du chargement des paramètres", err);
      setError("Impossible de charger les paramètres de sécurité. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const updateSecuritySetting = async (id: number, updatedSetting: Partial<SecuritySetting>) => {
    if (userRole !== "Admin") return alert("Permission refusée");
    setLoading(true);
    try {
      const response = await axios.patch<SecuritySetting>(`
        http://127.0.0.1:8000/api/security-settings/${id}/`,
        updatedSetting
      );
      setSecuritySettings(
        securitySettings.map((setting) => (setting.id === id ? response.data : setting))
      );
      if (response.data.name === "TwoFactorAuth") setTwoFactorEnabled(response.data.value === "true");
      if (response.data.name === "SessionTimeout") setSessionTimeout(parseInt(response.data.value as string));
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
      setError("Erreur lors de la mise à jour du paramètre. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const addSecuritySetting = async () => {
    if (userRole !== "Admin") return alert("Permission refusée");
    if (!newSetting.name || !newSetting.value) return alert("Veuillez remplir tous les champs.");
    setLoading(true);
    try {
      const response = await axios.post<SecuritySetting>(
        "http://127.0.0.1:8000/api/security-settings/",
        newSetting
      );
      setSecuritySettings([response.data, ...securitySettings]);
      setNewSetting({ name: "", value: "", description: "" });
    } catch (error) {
      console.error("Erreur lors de l'ajout", error);
      setError("Erreur lors de l'ajout du paramètre. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    if (userRole !== "Admin") return alert("Permission refusée");
    setLoading(true);
    try {
      const response = await axios.post<{ key: string }>("http://127.0.0.1:8000/api/generate-api-key/");
      alert(`Nouvelle clé API générée : ${response.data.key}`);
    } catch (error) {
      console.error("Erreur lors de la génération de la clé API", error);
      setError("Erreur lors de la génération de la clé API. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredLogs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Logs d'Authentification");
    XLSX.writeFile(wb, "security_authentication_logs.xlsx");
  };

  const handleSort = (field: keyof AuthLog) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="security-authentication-wrapper">
      <h2 className="page-title">Sécurité & Authentification</h2>

      <div className="security-authentication-content">
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : error ? (
          <div className="error-message">
            {error} <button onClick={fetchAuthLogs}><FontAwesomeIcon icon={faSync} /> Réessayer</button>
          </div>
        ) : (
          <>
            {/* Security Controls */}
            <div className="security-controls">
              <div className="search-bar">
                <FontAwesomeIcon icon={faSearch} />
                <input
                  type="text"
                  placeholder="Rechercher dans les logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="security-actions">
                <button onClick={generateApiKey}>
                  <FontAwesomeIcon icon={faKey} /> Générer Clé API
                </button>
                <button onClick={exportToExcel}>
                  <FontAwesomeIcon icon={faDownload} /> Exporter Logs
                </button>
              </div>
            </div>

            {/* Security Settings */}
            {userRole === "Admin" && (
              <div className="security-settings">
                <h3>Paramètres de Sécurité</h3>
                <div className="settings-form">
                  <input
                    type="text"
                    placeholder="Nom *"
                    value={newSetting.name}
                    onChange={(e) => setNewSetting({ ...newSetting, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Valeur *"
                    value={newSetting.value}
                    onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newSetting.description}
                    onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                  />
                  <button onClick={addSecuritySetting} disabled={loading}>
                    <FontAwesomeIcon icon={faPlus} /> Ajouter
                  </button>
                </div>
                <div className="settings-list">
                  {securitySettings.map((setting) => (
                    <div key={setting.id} className="setting-item">
                      <span>{setting.name}: {setting.value.toString()}</span>
                      <span>{setting.description}</span>
                      {setting.name === "TwoFactorAuth" && (
                        <button
                          onClick={() =>
                            updateSecuritySetting(setting.id, { value: !twoFactorEnabled })
                          }
                        >
                          <FontAwesomeIcon icon={twoFactorEnabled ? faUnlock : faLock} />
                          {twoFactorEnabled ? " Désactiver" : " Activer"}
                        </button>
                      )}
                      {setting.name === "SessionTimeout" && (
                        <input
                          type="number"
                          value={sessionTimeout}
                          onChange={(e) =>
                            updateSecuritySetting(setting.id, { value: e.target.value })
                          }
                          min="1"
                          style={{ width: "60px", marginLeft: "10px" }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Auth Logs */}
            <div className="auth-logs">
              <h3>Logs d'Authentification</h3>
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort("id")}>
                      ID {sortField === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => handleSort("user")}>
                      Utilisateur {sortField === "user" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => handleSort("action")}>
                      Action {sortField === "action" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => handleSort("timestamp")}>
                      Date {sortField === "timestamp" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => handleSort("ip_address")}>
                      Adresse IP {sortField === "ip_address" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((log) => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td>{log.user}</td>
                      <td>{log.action}</td>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                      <td>{log.ip_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Précédent</button>
                <span>Page {currentPage} / {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>Suivant</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SecurityAuthentication;