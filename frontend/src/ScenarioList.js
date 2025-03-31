import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Importa os ícones corretamente

const ScenarioList = ({ scenarios, onEdit, onDelete }) => {
  return (
    <ul>
      {scenarios.map((scenario) => (
        <li key={scenario.id}>
          <strong>ID:</strong> {scenario.id} - <strong>Name:</strong> {scenario.name} - <strong>Description:</strong> {scenario.description} - 
          <strong>Status:</strong> 
          <span className={`status-badge ${scenario.status === 'active' ? 'status-active' : 'status-inactive'}`}>
            {scenario.status}
          </span>
          <div className="action-buttons">
            <button onClick={() => onEdit(scenario.id)} title="Edit">
              <FaEdit /> {/* Ícone de edição */}
            </button>
            <button onClick={() => onDelete(scenario.id)} title="Delete">
              <FaTrash /> {/* Ícone de exclusão */}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ScenarioList;