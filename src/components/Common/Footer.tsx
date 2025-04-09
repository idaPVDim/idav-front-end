import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Dashboard. Tous droits réservés.</p>
        <ul className="footer-links">
          <li><a href="/privacy">Politique de confidentialité</a></li>
          <li><a href="/terms">Conditions d'utilisation</a></li>
          <li><a href="/contact">Contactez-nous</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;