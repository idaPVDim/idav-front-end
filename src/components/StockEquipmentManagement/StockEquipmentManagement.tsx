import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import usePagination from "../../hooks/usePagination";
import "./StockEquipmentManagement.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faDownload, faSync, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

interface StockEquipment {
  id: number;
  name: string;
  quantity: number;
  status: "Disponible" | "En rupture" | "En attente";
  store: string;
}

const StockEquipmentManagement: React.FC = () => {
  const { userRole } = useContext(AuthContext);
  const [items, setItems] = useState<StockEquipment[]>([]);
  const [newItem, setNewItem] = useState<StockEquipment>({
    id: 0,
    name: "",
    quantity: 0,
    status: "Disponible",
    store: "",
  });
  const [editItem, setEditItem] = useState<StockEquipment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof StockEquipment>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterStore, setFilterStore] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const navigate = useNavigate();

  const filteredItems = items
    .filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((item) => (filterStatus ? item.status === filterStatus : true))
    .filter((item) => (filterStore ? item.store === filterStore : true))
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const { paginatedData, currentPage, totalPages, nextPage, prevPage } = usePagination(filteredItems, 5);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<StockEquipment[]>("http://127.0.0.1:8000/api/stock-equipment/");
      setItems(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des stocks", err);
      setError("Impossible de charger les stocks. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (userRole !== "Admin") return alert("Permission refusée");
    if (!newItem.name || newItem.quantity < 0 || !newItem.store) {
      return alert("Veuillez remplir tous les champs obligatoires.");
    }
    setLoading(true);
    try {
      const response = await axios.post<StockEquipment>("http://127.0.0.1:8000/api/stock-equipment/", newItem);
      setItems([response.data, ...items]);
      setNewItem({ id: 0, name: "", quantity: 0, status: "Disponible", store: "" });
    } catch (error) {
      console.error("Erreur lors de l'ajout", error);
      setError("Erreur lors de l'ajout. Vérifiez les données et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async () => {
    if (userRole !== "Admin" || !editItem) return alert("Permission refusée");
    setLoading(true);
    try {
      const response = await axios.put<StockEquipment>(`
        http://127.0.0.1:8000/api/stock-equipment/${editItem.id}/`,
        editItem
      );
      setItems(items.map((item) => (item.id === editItem.id ? response.data : item)));
      setEditItem(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
      setError("Erreur lors de la mise à jour. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: number) => {
    if (userRole !== "Admin") return alert("Permission refusée");
    if (!window.confirm("Confirmer la suppression ?")) return;
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/stock-equipment/${id}/`);
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      setError("Erreur lors de la suppression. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredItems);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock & Équipements");
    XLSX.writeFile(wb, "stock_equipment_management.xlsx");
  };

  const handleSort = (field: keyof StockEquipment) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((iid) => iid !== id) : [...prev, id]
    );
  };

  const bulkDelete = async () => {
    if (userRole !== "Admin") return alert("Permission refusée");
    if (selectedItems.length === 0) return alert("Aucun élément sélectionné.");
    if (!window.confirm(`Supprimer ${selectedItems.length} éléments ?`)) return;
    setLoading(true);
    try {
      await Promise.all(
        selectedItems.map((id) => axios.delete(`http://127.0.0.1:8000/api/stock-equipment/${id}/`))
      );
      setItems(items.filter((item) => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    } catch (error) {
      console.error("Erreur lors de la suppression en masse", error);
      setError("Erreur lors de la suppression en masse. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stock-equipment-wrapper">
      <h2 className="page-title">Gestion des Stocks et Équipements</h2>

      <div className="stock-equipment-content">
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : error ? (
          <div className="error-message">
            {error} <button onClick={fetchItems}><FontAwesomeIcon icon={faSync} /> Réessayer</button>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="controls">
              <div className="search-bar">
                <FontAwesomeIcon icon={faSearch} />
                <input
                  type="text"
                  placeholder="Rechercher un équipement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filters">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Tous les statuts</option>
                  <option value="Disponible">Disponible</option>
                  <option value="En rupture">En rupture</option>
                  <option value="En attente">En attente</option>
                </select>
                <select
                  value={filterStore}
                  onChange={(e) => setFilterStore(e.target.value)}
                >
                  <option value="">Tous les magasins</option>
                  {Array.from(new Set(items.map((item) => item.store))).map((store) => (
                    <option key={store} value={store}>{store}</option>
                  ))}
                </select>
              </div>
              {userRole === "Admin" && (
                <div className="bulk-actions">
                  <button onClick={bulkDelete} disabled={selectedItems.length === 0}>
                    Supprimer sélection ({selectedItems.length})
                  </button>
                  <button onClick={exportToExcel}>
                    <FontAwesomeIcon icon={faDownload} /> Exporter
                  </button>
                </div>
              )}
            </div>

            {/* Add Item Form */}
            {userRole === "Admin" && (
              <div className="add-item-form">
                <input
                  type="text"
                  placeholder="Nom *"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Quantité *"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                />
                <select
                  value={newItem.status}
                  onChange={(e) =>
                    setNewItem({ ...newItem, status: e.target.value as "Disponible" | "En rupture" | "En attente" })
                  }
                >
                  <option value="Disponible">Disponible</option>
                  <option value="En rupture">En rupture</option>
                  <option value="En attente">En attente</option>
                </select>
                <input
                  type="text"
                  placeholder="Magasin *"
                  value={newItem.store}
                  onChange={(e) => setNewItem({ ...newItem, store: e.target.value })}
                />
                <button onClick={addItem} disabled={loading}>
                  <FontAwesomeIcon icon={faPlus} /> Ajouter
                </button>
              </div>
            )}

            {/* Items Table */}
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedItems(e.target.checked ? filteredItems.map((i) => i.id) : [])
                      }
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    />
                  </th>
                  <th onClick={() => handleSort("id")}>ID {sortField === "id" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                  <th onClick={() => handleSort("name")}>Nom {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                  <th onClick={() => handleSort("quantity")}>
                    Quantité {sortField === "quantity" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("status")}>Statut {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                  <th onClick={() => handleSort("store")}>Magasin {sortField === "store" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                  {userRole === "Admin" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                      />
                    </td>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.status}</td>
                    <td>{item.store}</td>
                    {userRole === "Admin" && (
                      <td>
                        <button onClick={() => setEditItem(item)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button onClick={() => deleteItem(item.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button onClick={prevPage} disabled={currentPage === 1}>Précédent</button>
              <span>Page {currentPage} / {totalPages}</span>
              <button onClick={nextPage} disabled={currentPage === totalPages}>Suivant</button>
            </div>

            {/* Edit Modal */}
            {editItem && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Modifier l'équipement</h3>
                  <input
                    type="text"
                    placeholder="Nom"
                    value={editItem.name}
                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Quantité"
                    value={editItem.quantity}
                    onChange={(e) => setEditItem({ ...editItem, quantity: parseInt(e.target.value) || 0 })}
                  />
                  <select
                    value={editItem.status}
                    onChange={(e) =>
                      setEditItem({ ...editItem, status: e.target.value as "Disponible" | "En rupture" | "En attente" })
                    }
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En rupture">En rupture</option>
                    <option value="En attente">En attente</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Magasin"
                    value={editItem.store}
                    onChange={(e) => setEditItem({ ...editItem, store: e.target.value })}
                  />
                  <div className="modal-actions">
                    <button onClick={updateItem} disabled={loading}>Mettre à jour</button>
                    <button onClick={() => setEditItem(null)}>Annuler</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StockEquipmentManagement;