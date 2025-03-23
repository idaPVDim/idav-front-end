import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserManagement.css'; // Import the CSS file for styling

// Définition du type pour un utilisateur
interface User {
  id: number;
  username: string;
  email: string;
  user_type: string;
  is_blocked: boolean;
  status?: string;
  last_login: string; // Add last_login field
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', user_type: 'Technicien' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>('http://127.0.0.1:8000/api/users/');
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs", error);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/', newUser);
      setUsers([response.data, ...users]); // Ajouter le nouvel utilisateur en haut de la liste
      setNewUser({ username: '', email: '', user_type: 'Technicien' });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur", error);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}/`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur", error);
    }
  };

  const notifyUser = async (id: number) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/users/${id}/notify/`);
      alert("Notification envoyée");
    } catch (error) {
      console.error("Erreur lors de la notification de l'utilisateur", error);
    }
  };

  const toggleBlockUser = async (id: number) => {
    try {
      const user = users.find(user => user.id === id);
      if (user) {
        await axios.post(`http://127.0.0.1:8000/api/users/${id}/block/`, { is_blocked: !user.is_blocked });
        setUsers(users.map(u => u.id === id ? { ...u, is_blocked: !u.is_blocked } : u));
      }
    } catch (error) {
      console.error("Erreur lors du blocage/déblocage de l'utilisateur", error);
    }
  };

  const updateUserStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/users/${id}/`, { status });
      setUsers(users.map(u => u.id === id ? { ...u, status } : u));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de l'utilisateur", error);
    }
  };

  const startEditing = (user: User) => {
    setEditingUser(user);
  };

  const cancelEditing = () => {
    setEditingUser(null);
  };

  const saveUser = async () => {
    if (editingUser) {
      try {
        const response = await axios.put(`http://127.0.0.1:8000/api/users/${editingUser.id}/`, editingUser);
        setUsers(users.map(u => u.id === editingUser.id ? response.data : u));
        setEditingUser(null);
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur", error);
      }
    }
  };

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>Gestion des utilisateurs</h2>
        <p>Welcome to the User Management section.</p>
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
            onChange={(e) => setNewUser({ ...newUser, user_type: e.target.value })}
          >
            <option value="Technicien">Technicien</option>
            <option value="Client">Client</option>
            <option value="Commerçant">Commerçant</option>
          </select>
          <button onClick={addUser}>Ajouter</button>
        </div>
      </div>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{editingUser && editingUser.id === user.id ? (
                  <input
                    type="text"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  />
                ) : (
                  user.username
                )}</td>
                <td>{editingUser && editingUser.id === user.id ? (
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                ) : (
                  user.email
                )}</td>
                <td>{editingUser && editingUser.id === user.id ? (
                  <select
                    value={editingUser.user_type}
                    onChange={(e) => setEditingUser({ ...editingUser, user_type: e.target.value })}
                  >
                    <option value="Technicien">Technicien</option>
                    <option value="Client">Client</option>
                    <option value="Commerçant">Commerçant</option>
                  </select>
                ) : (
                  user.user_type
                )}</td>
                <td>{user.is_blocked ? "Oui" : "Non"}</td>
                <td>{user.status || '-'}</td>
                <td>{user.last_login}</td>
                <td>
                  {editingUser && editingUser.id === user.id ? (
                    <>
                      <button className="action-button" onClick={saveUser}>Enregistrer</button>
                      <button className="action-button" onClick={cancelEditing}>Annuler</button>
                    </>
                  ) : (
                    <>
                      <button className="action-button" onClick={() => startEditing(user)}>Modifier</button>
                      <button className="action-button" onClick={() => notifyUser(user.id)}>Notifier</button>
                      <button className="action-button" onClick={() => toggleBlockUser(user.id)}>{user.is_blocked ? "Débloquer" : "Bloquer"}</button>
                      <button className="action-button" onClick={() => deleteUser(user.id)}>Supprimer</button>
                      <input
                        type="text"
                        placeholder="Statut"
                        value={user.status || ''}
                        onChange={(e) => updateUserStatus(user.id, e.target.value)}
                        className="status-input"
                      />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
