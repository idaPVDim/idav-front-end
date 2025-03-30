import React from "react";
import "./StockEquipmentManagement.css";

const StockEquipmentManagement: React.FC = () => {
  return (
    <div className="stock-management-wrapper">
      {/* Ruban fixe */}
      <div className="stock-management-header">
        <h2>Gestion des Stocks & des Équipements</h2>
      </div>

      {/* Contenu défilable */}
      <div className="stock-management-content">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Équipement</th>
                <th>Quantité</th>
                <th>État</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Contenu du tableau */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockEquipmentManagement;
