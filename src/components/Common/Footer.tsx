import React from "react";

const Footer: React.FC = () => {
  return (
    <div
      style={{
        height: "40px",
        backgroundColor: "#343a40",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p style={{ margin: 0 }}>© 2025 Dashboard. Tous droits réservés.</p>
    </div>
  );
};

export default Footer;
