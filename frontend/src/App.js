import React, { useState, useEffect } from 'react';

function App() {
  // Estado para armazenar os cenários e os dados do formulário
  const [scenarios, setScenarios] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // useEffect para buscar os cenários do backend ao carregar o componente
  useEffect(() => {
    fetch('http://localhost:3000/api/scenarios')
      .then((res) => res.json())
      .then((data) => setScenarios(data))
      .catch((err) => console.error('Error fetching scenarios:', err));
  }, []);

  // Atualiza os dados do formulário conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Envia os dados do formulário para criar um novo cenário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newScenario = await response.json();
      setScenarios([...scenarios, newScenario]);
      setFormData({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating scenario:', error);
    }
  };

  // Atualiza um cenário existente
  const handleEdit = async (id) => {
    const updatedScenario = { ...formData, status: 'updated' }; // Exemplo de atualização
    try {
      const response = await fetch(`http://localhost:3000/api/scenarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedScenario),
      });
      const result = await response.json();
      setScenarios(scenarios.map((s) => (s.id === id ? result : s)));
    } catch (error) {
      console.error('Error editing scenario:', error);
    }
  };

  // Exclui um cenário existente
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/scenarios/${id}`, { method: 'DELETE' });
      setScenarios(scenarios.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error deleting scenario:', error);
    }
  };

  return (
    <div>
      <h1>JQuality Tool</h1>
      <h2>Scenarios</h2>
      <ul>
        {scenarios.map((scenario) => (
          <li key={scenario.id}>
            <strong>{scenario.name}</strong>: {scenario.description} ({scenario.status})
            <button onClick={() => handleEdit(scenario.id)}>Edit</button>
            <button onClick={() => handleDelete(scenario.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Create Scenario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default App;
