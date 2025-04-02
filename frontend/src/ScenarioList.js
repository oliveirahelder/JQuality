import React from 'react';
//import { FaTrash, FaEdit } from 'react-icons/fa'; // Importa os ícones corretamente

const ScenarioList = ({ scenarios, onEdit, onDelete }) => {
  return (
    <table className="scenario-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {scenarios.map((scenario) => (
          <tr key={scenario.id}>
            <td>{scenario.name}</td>
            <td>{scenario.description}</td>
            <td>
              <span
                className={`status-badge ${
                  scenario.status === 'active' ? 'status-active' : 'status-inactive'
                }`}
              >
                {scenario.status}
              </span>
            </td>
            <td>
              <div className="scenario-actions">
                <button className="edit" onClick={() => onEdit(scenario.id)}>
                  Edit
                </button>
                <button className="delete" onClick={() => onDelete(scenario.id)}>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ScenarioList;