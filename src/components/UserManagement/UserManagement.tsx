import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import usePagination from "../../hooks/usePagination";
import "./UserManagement.css";

interface User {
  id: number;
  username: string;
  email: string;
  user_type: string;
  is_blocked: boolean;
  status?: string;
  last_login: string;
}

function UserManagement() {
  const { userRole } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ username: "", email: "", user_type: "Technicien" });
  const { paginatedData, currentPage, totalPages, nextPage, prevPage } = usePagination(users, 5);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>("http://127.0.0.1:8000/api/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs", error);
    }
  };

  const addUser = async () => {
    if (userRole !== "Admin") return alert("Permission refusée");
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/", newUser);
      setUsers([response.data, ...users]);
      setNewUser({ username: "", email: "", user_type: "Technicien" });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur", error);
    }
  };

  const deleteUser = async (id: number) => {
    if (userRole !== "Admin") return alert("Permission refusée");
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}/`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur", error);
    }
  };

  return (
    <div className="user-management-wrapper">
      {/* Harmonized Title (ruban) */}
      <h2 className="page-title">Gestion des Utilisateurs</h2>

      {userRole === "Admin" && (
        <div className="add-user-form">
          <input type="text" placeholder="Nom d'utilisateur" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
          <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          <select value={newUser.user_type} onChange={(e) => setNewUser({ ...newUser, user_type: e.target.value })}>
            <option value="Technicien">Technicien</option>
            <option value="Client">Client</option>
            <option value="Commerçant">Commerçant</option>
          </select>
          <button onClick={addUser}>Ajouter</button>
        </div>
      )}

      <div className="user-management-content">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom d'utilisateur</th>
              <th>Email</th>
              <th>Type</th>
              <th>Bloqué</th>
              <th>Statut</th>
              <th>Dernière connexion</th>
              {userRole === "Admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.user_type}</td>
                <td>{user.is_blocked ? "Oui" : "Non"}</td>
                <td>{user.status || "-"}</td>
                <td>{user.last_login}</td>
                {userRole === "Admin" && (
                  <td>
                    <button onClick={() => deleteUser(user.id)}>Supprimer</button>
                  </td>
                )}
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
    </div>
  );
}

export default UserManagement;