import './style.css';
import React, { useState, useEffect } from 'react';
import ScenarioList from './ScenarioList';
import ScenarioForm from './ScenarioForm';

function App() {
  const [showDrawer, setShowDrawer] = useState(false); // Controlar o menu lateral
  const [showScenarios, setShowScenarios] = useState(true); // Controlar a lista de cenários
  const [formData, setFormData] = useState({ name: '', description: '', status: 'active', tags: '' });
  const [scenarios, setScenarios] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa

  useEffect(() => {
    fetchScenarios();
  }, [searchTerm]); // Atualiza os cenários sempre que o termo de pesquisa mudar

  const fetchScenarios = () => {
    const url = searchTerm
      ? `http://localhost:3000/api/scenarios?search=${encodeURIComponent(searchTerm)}`
      : 'http://localhost:3000/api/scenarios';

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao procurar cenários');
        }
        return res.json();
      })
      .then((data) => setScenarios(data))
      .catch((err) => console.error('Erro ao procurar cenários:', err));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Atualiza o termo de pesquisa
  };

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
      } catch (error) {
        console.error('Erro ao criar cenário:', error);
      }
    }
    setFormData({ name: '', description: '', status: 'active', tags: '' }); // Limpa o formulário
    setShowDrawer(false); // Fecha o menu lateral
  };

  const handleEdit = (id) => {
    const scenario = scenarios.find((s) => s.id === id);
    setFormData({ name: scenario.name, description: scenario.description, status: scenario.status, tags: scenario.tags });
    setEditingId(id);
    setShowDrawer(true); // Abre o menu lateral para edição
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

      {/* Campo de pesquisa */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search scenarios by name, description or tags..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Botões principais */}
      <div className="main-buttons">
        <button onClick={() => setShowDrawer(true)}>Create Scenario</button>
        <button onClick={() => setShowScenarios(!showScenarios)}>
          {showScenarios ? 'Hide Scenarios' : 'Show Scenarios'}
        </button>
      </div>

      {/* Menu lateral */}
      {showDrawer && <div className="drawer-overlay open" onClick={() => setShowDrawer(false)}></div>}
      <div className={`drawer ${showDrawer ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>{editingId ? 'Edit Scenario' : 'Create Scenario'}</h2>
          <button className="drawer-close" onClick={() => setShowDrawer(false)}>
            &times;
          </button>
        </div>
        <ScenarioForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          editingId={editingId}
        />
      </div>

      {/* Lista de cenários */}
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