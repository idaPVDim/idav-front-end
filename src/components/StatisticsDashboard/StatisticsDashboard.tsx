import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import usePagination from "../../hooks/usePagination";
import "./StatisticsDashboard.css";

// Extend jsPDF for autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface Connection {
  id: number;
  user: string;
  date: string;
  province: string;
  status: string;
}

interface ConnectionPeriod {
  period: string;
  connections: number;
}

interface UserStat {
  type: string;
  count: number;
}

interface EquipmentStat {
  name: string;
  sales: number;
}

const COLORS = ["#8884d8", "#82ca9d", "#ff7300", "#ffc107"];

const StatisticsDashboard = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionData, setConnectionData] = useState<ConnectionPeriod[]>([]);
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [equipmentStats, setEquipmentStats] = useState<EquipmentStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { paginatedData, currentPage, totalPages, nextPage, prevPage } = usePagination(connections, 5);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [connRes, connPeriodRes, userRes, equipRes] = await Promise.all([
        axios.get<Connection[]>("http://127.0.0.1:8000/api/connections/"),
        axios.get<ConnectionPeriod[]>("http://127.0.0.1:8000/api/connection-periods/"),
        axios.get<UserStat[]>("http://127.0.0.1:8000/api/user-stats/"),
        axios.get<EquipmentStat[]>("http://127.0.0.1:8000/api/equipment-stats/"),
      ]);
      setConnections(connRes.data);
      setConnectionData(connPeriodRes.data);
      setUserStats(userRes.data);
      setEquipmentStats(equipRes.data);
    } catch (err) {
      console.error("Erreur lors du chargement des données", err);
      setError("Impossible de charger les données. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Statistiques et Historique de Connexion", 20, 20);
    doc.autoTable({
      startY: 30,
      head: [["ID", "Utilisateur", "Date", "Province", "Statut"]],
      body: connections.map((c) => [c.id, c.user, c.date, c.province, c.status]),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [30, 30, 47], textColor: [255, 255, 255] },
    });
    doc.save("statistics_dashboard.pdf");
  };

  const exportToExcel = () => {
    const wsConnections = XLSX.utils.json_to_sheet(connections);
    const wsUserStats = XLSX.utils.json_to_sheet(userStats);
    const wsEquipmentStats = XLSX.utils.json_to_sheet(equipmentStats);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsConnections, "Historique Connexions");
    XLSX.utils.book_append_sheet(wb, wsUserStats, "Statistiques Utilisateurs");
    XLSX.utils.book_append_sheet(wb, wsEquipmentStats, "Statistiques Équipements");
    XLSX.writeFile(wb, "statistics_dashboard.xlsx");
  };

  return (
    <div className="statistics-dashboard-wrapper">
      <h2 className="page-title">Statistiques et Historique de Connexion</h2>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Chargement des données...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="charts-container">
              <div className="chart-card">
                <h3>Connexions par période</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={connectionData}>
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="connections" fill={COLORS[0]} name="Connexions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Utilisateurs par type</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <>
                    <PieChart>
                      <Pie
                        data={userStats}
                        dataKey="count"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, value }) => `${name} (${value})`}
                      >
                        {userStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Équipements les plus vendus</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <>
                    <LineChart data={equipmentStats}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke={COLORS[2]} name="Ventes" />
                    </LineChart>
                  </>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="connection-history-section">
              <h3>Historique des Connexions</h3>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Utilisateur</th>
                    <th>Date</th>
                    <th>Province</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((connection) => (
                    <tr key={connection.id}>
                      <td>{connection.id}</td>
                      <td>{connection.user}</td>
                      <td>{connection.date}</td>
                      <td>{connection.province}</td>
                      <td>{connection.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>
                  Précédent
                </button>
                <span>
                  Page {currentPage} sur {totalPages}
                </span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>
                  Suivant
                </button>
              </div>
            </div>

            <div className="export-buttons">
              <button onClick={exportToPDF} className="export-btn export-pdf">
                Exporter en PDF
              </button>
              <button onClick={exportToExcel} className="export-btn export-excel">
                Exporter en Excel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatisticsDashboard;