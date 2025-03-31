import './style.css';
import React, { useState, useEffect } from 'react';
import ScenarioList from './ScenarioList';
import ScenarioForm from './ScenarioForm';

function App() {
  const [showForm, setShowForm] = useState(false); // Controlar o formulário
  const [showScenarios, setShowScenarios] = useState(true); // Controlar a lista de cenários
  const [formData, setFormData] = useState({ name: '', description: '', status: 'active' });
  const [loading, setLoading] = useState(true);
  const [scenarios, setScenarios] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // const toggleForm = () => {
  //   setShowForm(!showForm); // Alterna entre mostrar e esconder o formulário
  // };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      try {
        const response = await fetch(`http://localhost:3000/api/scenarios/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const updatedScenario = await response.json();
        setScenarios(scenarios.map((s) => (s.id === editingId ? updatedScenario : s)));
        setEditingId(null);
        setFormData({ name: '', description: '', status: 'active' });
      } catch (error) {
        console.error('Erro ao editar cenário:', error);
      }
    } else {
      try {
        const response = await fetch('http://localhost:3000/api/scenarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const newScenario = await response.json();
        setScenarios([...scenarios, newScenario]);
        setFormData({ name: '', description: '', status: 'active' });
      } catch (error) {
        console.error('Erro ao criar cenário:', error);
      }
    }
  };

  const handleEdit = (id) => {
    const scenario = scenarios.find((s) => s.id === id);
    setFormData({ name: scenario.name, description: scenario.description, status: scenario.status });
    setEditingId(id);
    setShowForm(true); // Mostra o formulário ao editar
  };

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
  
      {/* Botão para alternar o formulário */}
      <button onClick={() => setShowForm(!showForm)}>
        {editingId ? 'Edit Scenario' : showForm ? 'Hide Form' : 'Create Scenario'}
      </button>
  
      {/* Formulário condicional */}
      {showForm && (
        <ScenarioForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          editingId={editingId}
        />
      )}
  
      {/* Botão para alternar a lista de cenários */}
      <button onClick={() => setShowScenarios(!showScenarios)}>
        {showScenarios ? 'Hide Scenarios' : 'Show Scenarios'}
      </button>
  
      {/* Lista de cenários condicional */}
      {showScenarios && (
        <ScenarioList
          scenarios={scenarios}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;