import './style.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [scenarios, setScenarios] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'active' });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Buscar cenários do backend ao carregar o componente
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/api/scenarios')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao buscar cenários');
        }
        return res.json();
      })
      .then((data) => {
        setScenarios(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar cenários:', err);
        setLoading(false);
      });
  }, []);

  // Atualizar os dados do formulário conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Campo alterado:', { [name]: value }); // Log para verificar o valor
    setFormData({ ...formData, [name]: value });
  };

  // Criar ou editar um cenário
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Editar cenário existente
      try {
        console.log('Dados enviados para o backend:', formData);
        const response = await fetch(`http://localhost:3000/api/scenarios/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const updatedScenario = await response.json();
        setScenarios(scenarios.map((s) => (s.id === editingId ? updatedScenario : s)));
        setEditingId(null);
        setFormData({ name: '', description: '' , status: 'active'});
      } catch (error) {
        console.error('Erro ao editar cenário:', error);
      }
    } else {
      // Criar novo cenário
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
        console.error('Erro ao criar cenário:', error);
      }
    }
  };

  // Carregar dados do cenário no formulário para edição
  const handleEdit = (id) => {
    const scenario = scenarios.find((s) => s.id === id);
    setFormData({ name: scenario.name, description: scenario.description, status:scenario.status });
    setEditingId(id);
  };

  // Excluir um cenário existente
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/scenarios/${id}`, { method: 'DELETE' });
      setScenarios(scenarios.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Erro ao excluir cenário:', error);
    }
  };

  return (
    <div>
      <h1>JQuality Tool</h1>
      <h2>Scenarios</h2>
      {loading ? (
        <p>Loading scenarios...</p>
      ) : (
        <ul>
          {scenarios.map((scenario) => (
            <li key={scenario.id}>
              <strong>ID</strong> {scenario.id} - <strong>Name:</strong> {scenario.name} - <strong>Description:</strong> {scenario.description} - <strong>Status:</strong> {scenario.status}
              <button onClick={() => handleEdit(scenario.id)}>Edit</button>
              <button onClick={() => handleDelete(scenario.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <h2>{editingId ? 'Edit Scenario' : 'Create Scenario'}</h2>
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
        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

export default App;