import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Gestion des erreurs
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post("/auth/login/", { email, password });

      const token = response.data.token;
      localStorage.setItem("token", token); // Stocke le token localement
      dispatch(login(token));

      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      setError("Identifiants incorrects ou accès refusé.");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Se Connecter</button>
    </div>
  );
};

export default Login;