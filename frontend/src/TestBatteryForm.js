import React, { useState } from 'react';

const TestBatteryForm = ({ scenarios, onSubmit }) => {
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [ticketNumber, setTicketNumber] = useState('');
  const [name, setName] = useState('');

  const handleScenarioToggle = (id) => {
    setSelectedScenarios((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, ticket_number: ticketNumber, scenario_ids: selectedScenarios });
    onSubmit({ name, ticket_number: ticketNumber, scenario_ids: selectedScenarios });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Battery Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="ticketNumber">Ticket Number:</label>
        <input
          type="text"
          id="ticketNumber"
          value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
        />
      </div>
      <div>
        <h3>Select Scenarios:</h3>
        {scenarios.map((scenario) => (
          <div key={scenario.id}>
            <input
              type="checkbox"
              checked={selectedScenarios.includes(scenario.id)}
              onChange={() => handleScenarioToggle(scenario.id)}
            />
            {scenario.name}
          </div>
        ))}
      </div>
      <button type="submit">Create Test Battery</button>
    </form>
  );
};

export default TestBatteryForm;