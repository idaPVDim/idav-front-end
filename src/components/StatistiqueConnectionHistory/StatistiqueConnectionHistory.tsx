import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ConnectionHistory.css'; // Import the CSS file for styling

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

export default ConnectionHistory;
