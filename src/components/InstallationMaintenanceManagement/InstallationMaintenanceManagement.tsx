import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import usePagination from "../../hooks/usePagination";
import "./InstallationMaintenanceManagement.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faDownload, faSync, faFilter } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

interface InstallationMaintenance {
  id: number;
  equipment_name: string;
  location: string;
  type: "Installation" | "Maintenance";
  status: "Planifié" | "En cours" | "Terminé";
  assigned_technician: string;
  date_scheduled: string;
}

const InstallationMaintenanceManagement: React.FC = () => {
  const { userRole } = useContext(AuthContext);
  const [records, setRecords] = useState<InstallationMaintenance[]>([]);
  const [newRecord, setNewRecord] = useState<InstallationMaintenance>({
    id: 0,
    equipment_name: "",
    location: "",
    type: "Installation",
    status: "Planifié",
    assigned_technician: "",
    date_scheduled: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof InstallationMaintenance>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);

  const filteredRecords = records
    .filter((record) =>
      Object.values(record).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((record) => (filterType ? record.type === filterType : true))
    .filter((record) => (filterStatus ? record.status === filterStatus : true))
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const { paginatedData, currentPage, totalPages, nextPage, prevPage } = usePagination(filteredRecords, 5);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<InstallationMaintenance[]>(
        "http://127.0.0.1:8000/api/installations-maintenances/"
      );
      setRecords(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des enregistrements", err);
      setError("Impossible de charger les enregistrements. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async () => {
    if (userRole !== "Admin") return alert("Permission refusée");
    if (!newRecord.equipment_name || !newRecord.location || !newRecord.date_scheduled) {
      return alert("Veuillez remplir tous les champs obligatoires.");
    }
    setLoading(true);
    try {
      const response = await axios.post<InstallationMaintenance>(
        "http://127.0.0.1:8000/api/installations-maintenances/",
        newRecord
      );
      setRecords([response.data, ...records]);
      setNewRecord({
        id: 0,
        equipment_name: "",
        location: "",
        type: "Installation",
        status: "Planifié",
        assigned_technician: "",
        date_scheduled: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'enregistrement", error);
      setError("Erreur lors de l'ajout. Vérifiez les données et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: number) => {
    if (userRole !== "Admin") return alert("Permission refusée");
    if (!window.confirm("Confirmer la suppression ?")) return;
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/installations-maintenances/${id}/`);
      setRecords(records.filter((record) => record.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      setError("Erreur lors de la suppression. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: "Planifié" | "En cours" | "Terminé") => {
    if (userRole !== "Admin") return alert("Permission refusée");
    setLoading(true);
    try {
      await axios.patch(`http://127.0.0.1:8000/api/installations-maintenances/${id}/`, { status });
      setRecords(records.map((record) => (record.id === id ? { ...record, status } : record)));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut", error);
      setError("Erreur lors de la mise à jour du statut. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Installations & Maintenances");
    XLSX.writeFile(wb, "installation_maintenance_management.xlsx");
  };

  const handleSort = (field: keyof InstallationMaintenance) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const toggleSelectRecord = (id: number) => {
    setSelectedRecords((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const bulkDelete = async () => {
    if (userRole !== "Admin") return alert("Permission refusée");
    if (selectedRecords.length === 0) return alert("Aucun enregistrement sélectionné.");
    if (!window.confirm(`Supprimer ${selectedRecords.length} enregistrements ?`)) return;
    setLoading(true);
    try {
      await Promise.all(
        selectedRecords.map((id) =>
          axios.delete(`http://127.0.0.1:8000/api/installations-maintenances/${id}/`)
        )
      );
      setRecords(records.filter((record) => !selectedRecords.includes(record.id)));
      setSelectedRecords([]);
    } catch (error) {
      console.error("Erreur lors de la suppression en masse", error);
      setError("Erreur lors de la suppression en masse. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="installation-maintenance-wrapper">
      <h2 className="page-title">Gestion des Installations et Maintenances</h2>

      <div className="installation-maintenance-content">
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : error ? (
          <div className="error-message">
            {error} <button onClick={fetchRecords}><FontAwesomeIcon icon={faSync} /> Réessayer</button>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="controls">
              <div className="search-bar">
                <FontAwesomeIcon icon={faSearch} />
                <input
                  type="text"
                  placeholder="Rechercher un enregistrement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filters">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">Tous les types</option>
                  <option value="Installation">Installation</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Tous les statuts</option>
                  <option value="Planifié">Planifié</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                </select>
              </div>
              {userRole === "Admin" && (
                <div className="bulk-actions">
                  <button onClick={bulkDelete} disabled={selectedRecords.length === 0}>
                    Supprimer sélection ({selectedRecords.length})
                  </button>
                  <button onClick={exportToExcel}>
                    <FontAwesomeIcon icon={faDownload} /> Exporter
                  </button>
                </div>
              )}
            </div>

            {/* Add Record Form */}
            {userRole === "Admin" && (
              <div className="add-record-form">
                <input
                  type="text"
                  placeholder="Nom de l'équipement *"
                  value={newRecord.equipment_name}
                  onChange={(e) => setNewRecord({ ...newRecord, equipment_name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Lieu *"
                  value={newRecord.location}
                  onChange={(e) => setNewRecord({ ...newRecord, location: e.target.value })}
                />
                <select
                  value={newRecord.type}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, type: e.target.value as "Installation" | "Maintenance" })
                  }
                >
                  <option value="Installation">Installation</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                <select
                  value={newRecord.status}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, status: e.target.value as "Planifié" | "En cours" | "Terminé" })
                  }
                >
                  <option value="Planifié">Planifié</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                </select>
                <input
                  type="text"
                  placeholder="Technicien assigné"
                  value={newRecord.assigned_technician}
                  onChange={(e) => setNewRecord({ ...newRecord, assigned_technician: e.target.value })}
                />
                <input
                  type="datetime-local"
                  value={newRecord.date_scheduled}
                  onChange={(e) => setNewRecord({ ...newRecord, date_scheduled: e.target.value })}
                  required
                />
                <button onClick={addRecord} disabled={loading}>Ajouter</button>
              </div>
            )}

            {/* Records Table */}
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedRecords(e.target.checked ? filteredRecords.map((r) => r.id) : [])
                      }
                      checked={selectedRecords.length === filteredRecords.length && filteredRecords.length > 0}
                    />
                  </th>
                  <th onClick={() => handleSort("id")}>ID {sortField === "id" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                  <th onClick={() => handleSort("equipment_name")}>
                    Équipement {sortField === "equipment_name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("location")}>Lieu {sortField === "location" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                  <th onClick={() => handleSort("type")}>Type {sortField === "type" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                  <th onClick={() => handleSort("status")}>Statut {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                  <th onClick={() => handleSort("assigned_technician")}>
                    Technicien {sortField === "assigned_technician" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("date_scheduled")}>
                    Date {sortField === "date_scheduled" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  {userRole === "Admin" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => toggleSelectRecord(record.id)}
                      />
                    </td>
                    <td>{record.id}</td>
                    <td>{record.equipment_name}</td>
                    <td>{record.location}</td>
                    <td>{record.type}</td>
                    <td>
                      {userRole === "Admin" ? (
                        <select
                          value={record.status}
                          onChange={(e) =>
                            updateStatus(record.id, e.target.value as "Planifié" | "En cours" | "Terminé")
                          }
                        >
                          <option value="Planifié">Planifié</option>
                          <option value="En cours">En cours</option>
                          <option value="Terminé">Terminé</option>
                        </select>
                      ) : (
                        record.status
                      )}
                    </td>
                    <td>{record.assigned_technician || "-"}</td>
                    <td>{new Date(record.date_scheduled).toLocaleString()}</td>
                    {userRole === "Admin" && (
                      <td>
                        <button onClick={() => deleteRecord(record.id)}>Supprimer</button>
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
          </>
        )}
      </div>
    </div>
  );
};

export default InstallationMaintenanceManagement;