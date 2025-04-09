// UserManagement.tsx
// Importer les dépendances nécessaires
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import usePagination from "../../hooks/usePagination";
import "./UserManagement.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faDownload, faSync, faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

interface User {
  id: number;
  username: string;
  email: string;
  user_type: "Technicien" | "Client" | "Commerçant";
  is_blocked: boolean;
  status?: string;
  last_login: string;
}

const UserManagement: React.FC = () => {
  const { userRole } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({
    id: 0,
    username: "",
    email: "",
    user_type: "Technicien",
    is_blocked: false,
    last_login: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const filteredUsers = users
    .filter((user) =>
      Object.values(user).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if ((aVal ?? "") < (bVal ?? "")) return sortOrder === "asc" ? -1 : 1;
      if ((aVal ?? "") > (bVal ?? "")) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const { paginatedData, currentPage, totalPages, nextPage, prevPage } = usePagination(filteredUsers, 5);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<User[]>("http://127.0.0.1:8000/api/users/");
      setUsers(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs", err);
      setError("Impossible de charger les utilisateurs. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    if (userRole !== "Admin") return alert("Permission refusée");
    if (!newUser.username || !newUser.email) return alert("Veuillez remplir tous les champs.");
    setLoading(true);
    try {
      const response = await axios.post<User>("http://127.0.0.1:8000/api/users/", newUser);
      setUsers([response.data, ...users]);
      setNewUser({ id: 0, username: "", email: "", user_type: "Technicien", is_blocked: false, last_login: "" });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur", error);
      setError("Erreur lors de l'ajout. Vérifiez les données et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (userRole !== "Admin") return alert("Permission refusée");
    if (!window.confirm("Confirmer la suppression ?")) return;
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}/`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      setError("Erreur lors de la suppression. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockUser = async (id: number, is_blocked: boolean) => {
    if (userRole !== "Admin") return alert("Permission refusée");
    setLoading(true);
    try {
      await axios.patch(`http://127.0.0.1:8000/api/users/${id}/`, { is_blocked: !is_blocked });
      setUsers(users.map((user) => (user.id === id ? { ...user, is_blocked: !is_blocked } : user)));
    } catch (error) {
      console.error("Erreur lors du changement de statut", error);
      setError("Erreur lors du changement de statut. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredUsers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Utilisateurs");
    XLSX.writeFile(wb, "user_management.xlsx");
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const toggleSelectUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const bulkDelete = async () => {
    if (userRole !== "Admin") return alert("Permission refusée");
    if (selectedUsers.length === 0) return alert("Aucun utilisateur sélectionné.");
    if (!window.confirm(`Supprimer ${selectedUsers.length} utilisateurs ?`)) return;
    setLoading(true);
    try {
      await Promise.all(selectedUsers.map((id) => axios.delete(`http://127.0.0.1:8000/api/users/${id}/`)));
      setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    } catch (error) {
      console.error("Erreur lors de la suppression en masse", error);
      setError("Erreur lors de la suppression en masse. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-management-wrapper">
      <h2 className="page-title">Gestion des Utilisateurs</h2>

      <div className="user-management-content">
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : error ? (
          <div className="error-message">
            {error} <button onClick={fetchUsers}><FontAwesomeIcon icon={faSync} /> Réessayer</button>
          </div>
        ) : (
          <>
            {/* Search and Bulk Actions */}
            <div className="user-management-controls">
              <div className="search-bar">
                <FontAwesomeIcon icon={faSearch} />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {userRole === "Admin" && (
                <div className="bulk-actions">
                  <button onClick={bulkDelete} disabled={selectedUsers.length === 0}>
                    Supprimer sélection ({selectedUsers.length})
                  </button>
                  <button onClick={exportToExcel}>
                    <FontAwesomeIcon icon={faDownload} /> Exporter
                  </button>
                </div>
              )}
            </div>

            {/* Add User Form */}
            {userRole === "Admin" && (
              <div className="add-user-form">
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <select
                  value={newUser.user_type}
                  onChange={(e) => setNewUser({ ...newUser, user_type: e.target.value as User["user_type"] })}
                >
                  <option value="Technicien">Technicien</option>
                  <option value="Client">Client</option>
                  <option value="Commerçant">Commerçant</option>
                </select>
                <button onClick={addUser} disabled={loading}>Ajouter</button>
              </div>
            )}

            {/* Users Table */}
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedUsers(e.target.checked ? filteredUsers.map((u) => u.id) : [])
                      }
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    />
                  </th>
                  <th onClick={() => handleSort("id")}>ID {sortField === "id" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                  <th onClick={() => handleSort("username")}>Nom {sortField === "username" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                  <th onClick={() => handleSort("email")}>Email {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                  <th onClick={() => handleSort("user_type")}>Type {sortField === "user_type" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                  <th onClick={() => handleSort("is_blocked")}>Bloqué {sortField === "is_blocked" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                  <th>Statut</th>
                  <th onClick={() => handleSort("last_login")}>Dernière connexion {sortField === "last_login" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                  {userRole === "Admin" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                      />
                    </td>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.user_type}</td>
                    <td>{user.is_blocked ? "Oui" : "Non"}</td>
                    <td>{user.status || "-"}</td>
                    <td>{new Date(user.last_login).toLocaleString()}</td>
                    {userRole === "Admin" && (
                      <td>
                        <button
                          onClick={() => toggleBlockUser(user.id, user.is_blocked)}
                          title={user.is_blocked ? "Débloquer" : "Bloquer"}
                        >
                          <FontAwesomeIcon icon={user.is_blocked ? faUnlock : faLock} />
                        </button>
                        <button onClick={() => deleteUser(user.id)}>Supprimer</button>
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

export default UserManagement;