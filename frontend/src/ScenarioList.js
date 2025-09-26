const ScenarioList = ({ scenarios, isSelecting, selectedScenarios, onSelect, onEdit, onDelete, preview }) => {
  if (scenarios.length === 0) {
    return <p className="scenario-list-empty">No scenarios found. Try searching for something else.</p>;
  }

  // Função utilitária para garantir sempre string
  const fieldToString = field => {
    if (Array.isArray(field)) return field.join('\n');
    if (field && typeof field === "object") return JSON.stringify(field);
    return field || "";
  };

  return (
    <table className="scenario-table">
      <thead>
        <tr>
          {(isSelecting || preview) && <th>Select</th>}
          <th>Name</th>
          <th>Description</th>
          <th>Pre-conditions</th>
          <th>Steps</th>
          <th>Expected Results</th>
          <th>Priority</th>
          <th>Tags</th>
          <th>Status</th>
          {!preview && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {scenarios.map((scenario, idx) => (
          <tr key={scenario.id ?? scenario.tmp_id ?? idx}>
            {(isSelecting || preview) && (
              <td>
                <input
                  type="checkbox"
                  checked={selectedScenarios.includes(scenario.id ?? scenario.tmp_id ?? idx)}
                  onChange={() => onSelect(scenario.id ?? scenario.tmp_id ?? idx)}
                />
              </td>
            )}
            <td>{fieldToString(scenario.name)}</td>
            <td>{fieldToString(scenario.description)}</td>
            <td>{fieldToString(scenario.pre_conditions)}</td>
            <td>{fieldToString(scenario.steps)}</td>
            <td>{fieldToString(scenario.expected_results)}</td>
            <td>{fieldToString(scenario.priority)}</td>
            <td>{fieldToString(scenario.tags)}</td>
            <td>
              <span
                className={`status-badge ${
                  scenario.status === 'active' ? 'status-active' : 'status-inactive'
                }`}
              >
                {fieldToString(scenario.status)}
              </span>
            </td>
            {!preview && (
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
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ScenarioList;