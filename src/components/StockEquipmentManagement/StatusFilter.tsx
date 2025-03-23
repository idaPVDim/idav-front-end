import React from 'react';

interface StatusFilterProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ statusFilter, setStatusFilter }) => {
  return (
    <div className="status-filter">
      <label htmlFor="status">Filtrer par statut: </label>
      <select
        id="status"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">Tous</option>
        <option value="Available">Disponible</option>
        <option value="Unavailable">Indisponible</option>
      </select>
    </div>
  );
};

export default StatusFilter;
