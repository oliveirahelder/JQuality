import React, { useState } from 'react';

const STATUS_OPTIONS = [
  { value: "ready", label: "Ready to test", color: "#1e90ff" },
  { value: "in_progress", label: "In progress", color: "orange" },
  { value: "ok", label: "Ok", color: "green" },
  { value: "failed", label: "Failed", color: "red" },
  { value: "blocked", label: "Blocked", color: "gold" }
];

function TestBattery({ battery, onMoveToCompleted, readOnly }) {
  const [scenarios, setScenarios] = useState(battery.scenarios);

  const isFinal =
    scenarios.length > 0 &&
    scenarios.every(s => s.status === "ok" || s.status === "failed");

  const handleChangeStatus = (id, status) => {
    if (readOnly) return;
    const newScenarios = scenarios.map(s =>
      s.id === id ? { ...s, status } : s
    );
    setScenarios(newScenarios);
  };

  return (
    <div className="test-battery">
      <h3>{battery.name} (Ticket: {battery.ticket_number})</h3>
      <ul>
        {scenarios.map((scenario) => {
          const statusObj = STATUS_OPTIONS.find(o => o.value === scenario.status) || STATUS_OPTIONS[0];
          return (
            <li key={scenario.id}>
              {scenario.name} - Status:&nbsp;
              <span
                style={{
                  background: statusObj.color,
                  color: '#fff',
                  borderRadius: 4,
                  padding: "2px 7px",
                  marginRight: 8,
                  fontWeight: 500,
                  fontSize: "0.98em"
                }}
              >
                {statusObj.label}
              </span>
              {!readOnly && (
                <select
                  value={scenario.status}
                  onChange={e => handleChangeStatus(scenario.id, e.target.value)}
                  style={{ marginLeft: 2 }}
                  disabled={isFinal}
                >
                  {STATUS_OPTIONS.map(opt =>
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  )}
                </select>
              )}
            </li>
          );
        })}
      </ul>
      {!readOnly && isFinal && onMoveToCompleted && (
        <button
          style={{
            marginTop: 12,
            background: "green",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 6,
            padding: '6px 18px',
            border: 'none'
          }}
          onClick={() => onMoveToCompleted({ ...battery, scenarios })}
        >
          Mover para Completed Test Batteries
        </button>
      )}
    </div>
  );
}

export default TestBattery;