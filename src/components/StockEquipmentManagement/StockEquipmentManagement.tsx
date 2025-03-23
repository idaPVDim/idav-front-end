import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StockEquipmentManagement.css';
import StatusFilter from './StatusFilter';

interface StockEquipment {
  id: number;
  name: string;
  quantity: number;
  status: string;
  store: string;
}

function StockEquipmentManagement() {
  const [items, setItems] = useState<StockEquipment[]>([]);
  const [filteredItems, setFilteredItems] = useState<StockEquipment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItemsByStatus();
  }, [items, statusFilter]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get<StockEquipment[]>('http://127.0.0.1:8000/api/stock-equipment/');
      setItems(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des stocks et équipements", error);
    } finally {
      setLoading(false);
    }
  };

  const filterItemsByStatus = () => {
    if (statusFilter === 'All') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.status === statusFilter));
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="stock-equipment-management-container">
      <h2 className="stock-equipment-management-title">Gestion des stocks et équipements</h2>
      <button onClick={fetchItems} className="refresh-button">Rafraîchir</button>
      <StatusFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      <div className="sidebar-navigation">
        <button onClick={() => handleNavigation('/dashboard')}>Dashboard</button>
        <button onClick={() => handleNavigation('/reports')}>Reports</button>
        <button onClick={() => handleNavigation('/settings')}>Settings</button>
      </div>
      {loading ? (
        <div className="loading-spinner">Chargement...</div>
      ) : (
        <table className="stock-equipment-management-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Quantité</th>
              <th>Statut</th>
              <th>Magasin</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.status}</td>
                <td>{item.store}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StockEquipmentManagement;
