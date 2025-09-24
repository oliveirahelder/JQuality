import React from 'react';

function TestBattery({ battery }) {
  return (
    <div className="test-battery">
      <h3>{battery.name} (Ticket: {battery.ticket_number})</h3>
      <ul>
        {battery.scenarios.map((scenario) => (
          <li key={scenario.id}>
            {scenario.name} - Status: {scenario.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TestBattery;