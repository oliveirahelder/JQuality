import React from 'react';

const ScenarioList = ({ scenarios, onEdit, onDelete }) => {
  return (
    <ul>
      {scenarios.map((scenario) => (
        <li key={scenario.id}>
          <strong>ID:</strong> {scenario.id} - <strong>Name:</strong> {scenario.name} - <strong>Description:</strong> {scenario.description} - <strong>Status:</strong> {scenario.status}
          <button onClick={() => onEdit(scenario.id)}>Edit</button>
          <button onClick={() => onDelete(scenario.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default ScenarioList;