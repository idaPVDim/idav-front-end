import React, { useState, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createSlice } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock, faEnvelope, faKey, faShieldAlt } from "@fortawesome/free-solid-svg-icons";

export const login = createSlice({
  name: "auth",
  initialState: { token: null, role: null },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
    },
  },
});

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isTwoFactorRequired, setIsTwoFactorRequired] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userRole } = useContext(AuthContext);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && userRole) {
      navigate("/dashboard");
    }
  }, [userRole, navigate]);

  const validateForm = () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez entrer un email valide.");
      return false;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return false;
    }
    if (isTwoFactorRequired && !twoFactorCode) {
      setError("Veuillez entrer le code 2FA.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = isTwoFactorRequired
        ? { email, password, two_factor_code: twoFactorCode }
        : { email, password };

      const response = await axiosInstance.post("/auth/login/", payload);

      console.log("Login response:", response.data);

      if (response.data.requires_2fa) {
        setIsTwoFactorRequired(true);
        setSuccess("Veuillez entrer votre code 2FA envoyé à votre email.");
        setLoading(false);
        return;
      }

      const { token, role } = response.data;
      localStorage.setItem("token", token);
      dispatch(login.actions.login({ token, role }));

      setSuccess("Connexion réussie ! Redirection...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error: any) {
      console.error("Login failed", error.response?.data || error.message);
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        "Erreur de connexion. Vérifiez vos identifiants ou contactez l'administrateur.";
      setError(errorMsg);
    } finally {
      if (!isTwoFactorRequired) setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleForgotPassword = () => {
    if (!email) {
      setError("Veuillez entrer votre email pour réinitialiser le mot de passe.");
      return;
    }
    // Placeholder for forgot password logic
    alert("Fonctionnalité de réinitialisation à implémenter.");
    // Example API call: axiosInstance.post("/auth/forgot-password/", { email });
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="login-title">
          <FontAwesomeIcon icon={faShieldAlt} /> Connexion Administrateur
        </h2>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
              disabled={loading}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          {isTwoFactorRequired && (
            <div className="input-group">
              <FontAwesomeIcon icon={faKey} className="input-icon" />
              <input
                type="text"
                placeholder="Code 2FA"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Connexion en cours..." : "Se Connecter"}
          </button>
        </form>

        <div className="login-options">
          <button
            className="forgot-password"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            Mot de passe oublié ?
          </button>
          <p>
            Pas de compte ?{" "}
            <a href="/register" className="register-link">
              Contactez l'administrateur
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;