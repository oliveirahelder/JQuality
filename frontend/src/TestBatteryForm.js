import React, { useState } from 'react';

function TestBatteryForm({ scenarios, onSubmit }) {
  const [ticketNumber, setTicketNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticketNumber || scenarios.length === 0) {
      alert('Preencha o número do ticket e selecione pelo menos um cenário.');
      return;
    }
  
    console.log('Enviando dados para criar bateria:', { ticketNumber, scenarioIds: scenarios.map((s) => s.id) }); // Log para depuração
    onSubmit({ ticketNumber, scenarioIds: scenarios.map((s) => s.id) });
    setTicketNumber('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Criar Bateria de Teste</h3>
      <div>
        <label>Número do Ticket:</label>
        <input
          type="text"
          value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <h4>Selecionados:</h4>
        <ul>
          {scenarios.map((scenario) => (
            <li key={scenario.id}>{scenario.name}</li>
          ))}
        </ul>
      </div>
      <button type="submit">Criar Bateria</button>
    </form>
  );
}

export default TestBatteryForm;