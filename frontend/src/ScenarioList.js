const ScenarioList = ({ scenarios, isSelecting, selectedScenarios, onSelect, onEdit, onDelete }) => {
  if (scenarios.length === 0) {
    return <p className="scenario-list-empty">No scenarios found. Try searching for something else.</p>;
  }

  return (
    <table className="scenario-table">
      <thead>
        <tr>
          {isSelecting && <th>Select</th>}
          <th>Name</th>
          <th>Description</th>
          <th>Pre-conditions</th>
          <th>Steps</th>
          <th>Expected Results</th>
          <th>Priority</th>
          <th>Tags</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {scenarios.map((scenario) => (
          <tr key={scenario.id}>
            {isSelecting && (
              <td>
                <input
                  type="checkbox"
                  checked={selectedScenarios.includes(scenario.id)}
                  onChange={() => onSelect(scenario.id)}
                />
              </td>
            )}
            <td>{scenario.name}</td>
            <td>{scenario.description}</td>
            <td>{scenario.pre_conditions}</td>
            <td>{scenario.steps}</td>
            <td>{scenario.expected_results}</td>
            <td>{scenario.priority}</td>
            <td>{scenario.tags}</td>
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