import './style.css';
import React, { useState, useEffect } from 'react';
import ScenarioList from './ScenarioList';
import ScenarioForm from './ScenarioForm';
import TestBatteryForm from './TestBatteryForm'; // Importando o componente de bateria de teste
import TestBattery from './TestBattery';

function App() {
  // Estados
  const [showDrawer, setShowDrawer] = useState(false); // Controlar o menu lateral
  const [showScenarios, setShowScenarios] = useState(true); // Controlar a lista de cenários
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pre_conditions: '',
    steps: '',
    expected_results: '',
    priority: 'medium',
    status: 'active',
    tags: ''
  }); // Estado para os dados do formulário
  const [scenarios, setScenarios] = useState([]); // Lista de cenários
  const [editingId, setEditingId] = useState(null); // ID do cenário em edição
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa
  //const [testBatteries, setTestBatteries] = useState([]); // Estado para armazenar as baterias de teste
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [pendingBatteries, setPendingBatteries] = useState([]); // Baterias pendentes
  const [completedBatteries, setCompletedBatteries] = useState([]); // Baterias concluídas

  const toggleSelectionMode = () => {
    setIsSelecting(!isSelecting);
    setSelectedScenarios([]);
  };

  const handleScenarioSelect = (id) => {
    setSelectedScenarios((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
    console.log('Cenários selecionados:', selectedScenarios); // Log para depuração
  };

  // Função para buscar cenários com base no termo de pesquisa
  const fetchScenarios = async () => {
    const url = searchTerm
      ? `http://localhost:3000/api/scenarios?search=${encodeURIComponent(searchTerm)}`
      : 'http://localhost:3000/api/scenarios';

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao procurar cenários');
      }
      const data = await response.json();
      setScenarios(data); // Atualiza o estado com os cenários encontrados
    } catch (error) {
      console.error('Erro ao procurar cenários:', error);
    }
  };

  // Função para buscar baterias de teste
  const fetchTestBatteries = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/test-batteries');
      if (!response.ok) {
        throw new Error('Erro ao buscar baterias de teste');
      }
      const data = await response.json();
      console.log('Baterias de teste recebidas:', data); // Log para depuração
  
      // Separar baterias pendentes e concluídas
      const pending = data.filter((battery) =>
        battery.scenarios.some((scenario) => scenario.status !== 'pass')
      );
      const completed = data.filter((battery) =>
        battery.scenarios.every((scenario) => scenario.status === 'pass')
      );
  
      setPendingBatteries(pending);
      setCompletedBatteries(completed);
    } catch (error) {
      console.error('Erro ao buscar baterias de teste:', error);
    }
  };

  // useEffect para buscar cenários e baterias ao carregar o componente
  useEffect(() => {
    fetchScenarios();
    fetchTestBatteries();
  }, [searchTerm]); // Atualiza os cenários sempre que o termo de pesquisa mudar

  // Atualizar o termo de pesquisa
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Atualiza o termo de pesquisa
  };

  // Atualizar os dados do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submeter o formulário para criar ou editar cenários
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Dados enviados para o backend:', formData); // Log dos dados do formulário
    const url = editingId
      ? `http://localhost:3000/api/scenarios/${editingId}`
      : 'http://localhost:3000/api/scenarios';
    const method = editingId ? 'PUT' : 'POST';
  
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Resposta do backend:', data); // Log da resposta do backend
      if (editingId) {
        setScenarios(scenarios.map((s) => (s.id === editingId ? data : s)));
      } else {
        setScenarios([...scenarios, data]);
      }
      setFormData({
        name: '',
        description: '',
        pre_conditions: '',
        steps: '',
        expected_results: '',
        priority: 'medium',
        status: 'active',
        tags: ''
      });
      setEditingId(null);
      setShowDrawer(false);
    } catch (error) {
      console.error('Erro ao salvar cenário:', error); // Log de erros
    }
  };

  // Editar um cenário existente
  const handleEdit = (id) => {
    const scenario = scenarios.find((s) => s.id === id);
    if (!scenario) {
      console.error(`Scenario with ID ${id} not found.`);
      return;
    }
  
    setFormData({
      name: scenario.name || '',
      description: scenario.description || '',
      pre_conditions: scenario.pre_conditions || '',
      steps: scenario.steps || '',
      expected_results: scenario.expected_results || '',
      priority: scenario.priority || 'medium',
      status: scenario.status || 'active',
      tags: scenario.tags || ''
    }); // Preenche o formulário com os dados do cenário
    setEditingId(id);
    setShowDrawer(true); // Abre o menu lateral para edição
  };

  // Excluir um cenário
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/scenarios/${id}`, { method: 'DELETE' });
      setScenarios(scenarios.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Erro ao excluir cenário:', error);
    }
  };

  // Criar uma bateria de teste
  const handleCreateTestBattery = async ({ ticketNumber, scenarioIds }) => {
    console.log('Criando bateria de teste com os dados:', { ticketNumber, scenarioIds }); // Log para depuração
  
    try {
      const response = await fetch('http://localhost:3000/api/test-batteries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Bateria - ${ticketNumber}`,
          ticket_number: ticketNumber,
          scenario_ids: scenarioIds,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro ao criar bateria de teste:', errorData); // Log detalhado do erro
        throw new Error('Erro ao criar bateria de teste');
      }
  
      const newBattery = await response.json();
      console.log('Bateria criada com sucesso:', newBattery); // Log de sucesso
      fetchTestBatteries(); // Atualiza as baterias após criar
    } catch (error) {
      console.error('Erro ao criar bateria de teste:', error); // Log de erros
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
        <button onClick={toggleSelectionMode}>
          {isSelecting ? 'Cancel Selection' : 'Select Scenarios'}
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
          isSelecting={isSelecting}
          selectedScenarios={selectedScenarios}
          onSelect={handleScenarioSelect}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/*Formulário para criar baterias de teste*/}
      {isSelecting && (
        <TestBatteryForm
          scenarios={scenarios.filter((s) => selectedScenarios.includes(s.id))}
          onSubmit={handleCreateTestBattery}
        />
      )}

      {/* Lista de baterias de teste */} 
      <div>
        <h2>Pending Test Batteries</h2>
        {pendingBatteries.map((battery) => (
          <TestBattery key={battery.id} battery={battery} />
        ))}

        <h2>Completed Test Batteries</h2>
        {completedBatteries.map((battery) => (
          <TestBattery key={battery.id} battery={battery} />
        ))}
      </div>

      
    </div>
  );
}

export default App;