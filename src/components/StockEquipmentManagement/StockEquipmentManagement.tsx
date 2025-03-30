/* import React, { useEffect, useState } from 'react';
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
    <div className="stock-equipment-management">
      <header className="management-header">
        <h2>Gestion des stocks et équipements</h2>
      </header>
      <main className="management-content">
        <div className="management-actions">
          <button onClick={fetchItems} className="refresh-button">Rafraîchir</button>
          <StatusFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
        </div>
        <nav className="management-nav">
          <button onClick={() => handleNavigation('/dashboard')}>Dashboard</button>
          <button onClick={() => handleNavigation('/reports')}>Reports</button>
          <button onClick={() => handleNavigation('/settings')}>Settings</button>
        </nav>
        {loading ? (
          <div className="loading-spinner">Chargement...</div>
        ) : (
          <div className="table-container">
            <table className="management-table">
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
          </div>
        )}
      </main>
    </div>
  );
}

export default StockEquipmentManagement;
 */


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
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<StockEquipment[]>('http://127.0.0.1:8000/api/stock-equipment/');
      setItems(response.data);
    } catch (error) {
      setError("Erreur lors du chargement des stocks et équipements. Veuillez réessayer.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet élément ?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/stock-equipment/${id}/`);
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      setError("Erreur lors de la suppression de l'élément.");
      console.error(error);
    }
  };

  const filteredItems = items
    .filter(item => statusFilter === 'All' || item.status === statusFilter)
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="stock-equipment-management">
      <header className="management-header">
        <h2>Gestion des stocks et équipements</h2>
      </header>
      <main className="management-content">
        <div className="management-actions">
          <input
            type="text"
            placeholder="Rechercher un équipement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={fetchItems} className="refresh-button">Rafraîchir</button>
          <StatusFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
        </div>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div className="loading-spinner">Chargement...</div>
        ) : (
          <div className="table-container">
            <table className="management-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Quantité</th>
                  <th>Statut</th>
                  <th>Magasin</th>
                  <th>Actions</th>
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
                    <td>
                      <button className="edit-button">Modifier</button>
                      <button className="delete-button" onClick={() => deleteItem(item.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default StockEquipmentManagement;