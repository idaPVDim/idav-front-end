/* import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import './ConnectionHistory.css'; // Import the CSS file for styling

interface Connection {
  id: number;
  user: string;
  date: string;
  province: string;
  status: string;
}

function ConnectionHistory() {
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await axios.get<Connection[]>('http://127.0.0.1:8000/api/connections/');
      setConnections(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique de connexion", error);
    }
  };

  return (
    <div className="connection-history-container">
      <h2 className="connection-history-title">Historique de connexion</h2>
      <table className="connection-history-table">
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
          {connections.map(connection => (
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
    </div>
  );
}

export default ConnexionHistory;
 */




import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./StatisticConnexionHistory.css";

const colors = ["#8884d8", "#82ca9d", "#ff7300"];

const StatisticsDashboard = () => {
  const [connectionData, setConnectionData] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [equipmentStats, setEquipmentStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [connRes, userRes, equipRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/connections"),
        axios.get("http://127.0.0.1:8000/api/user-stats"),
        axios.get("http://127.0.0.1:8000/api/equipment-stats")
      ]);
      setConnectionData(connRes.data);
      setUserStats(userRes.data);
      setEquipmentStats(equipRes.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données", error);
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Statistiques et Historique de Connexion</h2>
      {loading ? (
        <div className="loading">Chargement...</div>
      ) : (
        <div className="charts-container">
          <div className="chart-card">
            <h3>Connexions par période</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={connectionData}>
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="connections" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Utilisateurs par type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={userStats} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={80}>
                  {userStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Équipements les plus vendus</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={equipmentStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="export-buttons">
        <button onClick={() => console.log("Exporter PDF")} className="export-btn">Exporter PDF</button>
        <button onClick={() => console.log("Exporter Excel")} className="export-btn">Exporter Excel</button>
      </div>
    </div>
  );
};

export default StatisticsDashboard;