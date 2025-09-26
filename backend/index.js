const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

const axios = require('axios');
require('dotenv').config();

// ==========================
// Middlewares
// ==========================
app.use(express.json());
app.use(cors());

// ==========================
// Configuração do Banco de Dados SQLite
// ==========================
const db = new sqlite3.Database('./jquality.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criação de tabelas se não existirem
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS scenarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    pre_conditions TEXT,
    steps TEXT,
    expected_results TEXT,
    priority TEXT,
    status TEXT DEFAULT 'active',
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  // Criação da tabela de baterias de teste
  db.run(`
    CREATE TABLE IF NOT EXISTS test_batteries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ticket_number TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Criação da tabela de cenários associados às baterias de teste
  db.run(`
    CREATE TABLE IF NOT EXISTS test_battery_scenarios (
      battery_id INTEGER,
      scenario_id INTEGER,
      status TEXT DEFAULT 'ready',
      FOREIGN KEY (battery_id) REFERENCES test_batteries(id),
      FOREIGN KEY (scenario_id) REFERENCES scenarios(id)
    )
  `);
});

// ==========================
// Rotas Principais
// ==========================
app.get('/', (_req, res) => {
  res.send('Welcome to JQuality Backend!!');
});

// ==========================
// Rotas para Test Batteries
// ==========================
app.get('/api/test-batteries', (req, res) => {
  const query = `
    SELECT tb.id AS battery_id, tb.name AS battery_name, tb.ticket_number, s.id AS scenario_id, s.name AS scenario_name
    FROM test_batteries tb
    LEFT JOIN test_battery_scenarios tbs ON tb.id = tbs.battery_id
    LEFT JOIN scenarios s ON tbs.scenario_id = s.id
    WHERE tb.archived = 0
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const batteries = rows.reduce((acc, row) => {
        const battery = acc.find((b) => b.id === row.battery_id);
        if (battery) {
          battery.scenarios.push({ id: row.scenario_id, name: row.scenario_name });
        } else {
          acc.push({
            id: row.battery_id,
            name: row.battery_name,
            ticket_number: row.ticket_number,
            scenarios: row.scenario_id ? [{ id: row.scenario_id, name: row.scenario_name }] : [],
          });
        }
        return acc;
      }, []);
      res.json(batteries);
    }
  });
});

app.post('/api/test-batteries', (req, res) => {
  const { name, ticket_number, scenario_ids } = req.body;

  db.run(
    'INSERT INTO test_batteries (name, ticket_number) VALUES (?, ?)',
    [name, ticket_number],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        const batteryId = this.lastID;
        const placeholders = scenario_ids.map(() => '(?, ?, ?)').join(',');
        const query = `INSERT INTO test_battery_scenarios (battery_id, scenario_id, status) VALUES ${placeholders}`;
        const params = scenario_ids.flatMap((id) => [batteryId, id, 'ready']);
        db.run(query, params, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.status(201).json({ id: batteryId, name, ticket_number });
          }
        });
      }
    }
  );
});

// ==========================
// Rotas para Scenarios
// ==========================
app.get('/api/scenarios', (req, res) => {
  const { search } = req.query;
  let query = 'SELECT * FROM scenarios';
  const params = [];

  if (search) {
    query += ' WHERE name LIKE ? OR description LIKE ? OR tags LIKE ?';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm); // Inclui tags na pesquisa
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.get('/api/scenarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM scenarios WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ message: 'Scenario not found' });
    } else {
      res.json(row);
    }
  });
});

app.post('/api/scenarios', (req, res) => {
  console.log('Dados recebidos no backend:', req.body); // Log dos dados recebidos
  const { name, description, pre_conditions, steps, expected_results, priority, tags } = req.body;

  const query = `
      INSERT INTO scenarios (name, description, pre_conditions, steps, expected_results, priority, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(query, [name, description, pre_conditions, steps, expected_results, priority, tags], function (err) {
      if (err) {
          console.error('Erro ao inserir no banco de dados:', err.message); // Log do erro
          res.status(500).json({ error: err.message });
      } else {
          res.status(201).json({ id: this.lastID, name, description, pre_conditions, steps, expected_results, priority, tags, status: 'active' });
      }
  });
});

app.put('/api/scenarios/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, pre_conditions, steps, expected_results, priority, status, tags } = req.body;

  const query = `
    UPDATE scenarios
    SET name = ?, description = ?, pre_conditions = ?, steps = ?, expected_results = ?, priority = ?, status = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(query, [name, description, pre_conditions, steps, expected_results, priority, status, tags, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: 'Scenario not found' });
    } else {
      res.json({ id, name, description, pre_conditions, steps, expected_results, priority, status, tags });
    }
  });
});

app.delete('/api/scenarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM scenarios WHERE id = ?';
  db.run(query, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: 'Scenario not found' });
    } else {
      console.log('Cenário excluído com sucesso:', id);
      res.status(204).send();
    }
  });
});

app.post('/api/test-batteries', (req, res) => {
  console.log('Dados recebidos no backend para criar bateria:', req.body); // Log para depuração
  const { name, ticket_number, scenario_ids } = req.body;

  if (!name || !ticket_number || !scenario_ids || scenario_ids.length === 0) {
    console.error('Dados inválidos recebidos:', req.body); // Log de erro
    return res.status(400).json({ error: 'Dados inválidos. Certifique-se de enviar nome, número do ticket e cenários.' });
  }

  db.run(
    'INSERT INTO test_batteries (name, ticket_number) VALUES (?, ?)',
    [name, ticket_number],
    function (err) {
      if (err) {
        console.error('Erro ao inserir bateria no banco de dados:', err.message); // Log de erro
        return res.status(500).json({ error: err.message });
      }

      const batteryId = this.lastID;
      const placeholders = scenario_ids.map(() => '(?, ?, ?)').join(',');
      const query = `INSERT INTO test_battery_scenarios (battery_id, scenario_id, status) VALUES ${placeholders}`;
      const params = scenario_ids.flatMap((id) => [batteryId, id, 'ready']);

      db.run(query, params, (err) => {
        if (err) {
          console.error('Erro ao inserir cenários na bateria:', err.message); // Log de erro
          return res.status(500).json({ error: err.message });
        }

        console.log('Bateria criada com sucesso:', { id: batteryId, name, ticket_number }); // Log de sucesso
        res.status(201).json({ id: batteryId, name, ticket_number });
      });
    }
  );
});

app.patch('/api/batteries/:id/archive', (req, res) => {
  const batteryId = req.params.id;
  db.run("UPDATE test_batteries SET archived = 1 WHERE id = ?", [batteryId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.get('/api/test-batteries', (req, res) => {
  const query = `
    SELECT tb.id AS battery_id, tb.name AS battery_name, tb.ticket_number, tbs.scenario_id, tbs.status, s.name AS scenario_name
    FROM test_batteries tb
    LEFT JOIN test_battery_scenarios tbs ON tb.id = tbs.battery_id
    LEFT JOIN scenarios s ON tbs.scenario_id = s.id
    WHERE tb.archived = 0
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const batteries = rows.reduce((acc, row) => {
        const battery = acc.find((b) => b.id === row.battery_id);
        if (battery) {
          battery.scenarios.push({
            id: row.scenario_id,
            name: row.scenario_name,
            status: row.status,
          });
        } else {
          acc.push({
            id: row.battery_id,
            name: row.battery_name,
            ticket_number: row.ticket_number,
            scenarios: row.scenario_id
              ? [
                  {
                    id: row.scenario_id,
                    name: row.scenario_name,
                    status: row.status,
                  },
                ]
              : [],
          });
        }
        return acc;
      }, []);
      res.json(batteries);
    }
  });
});

app.get('/api/test-batteries/history', (req, res) => {
  const query = `
    SELECT tb.id AS battery_id, tb.name AS battery_name, tb.ticket_number, tbs.scenario_id, tbs.status, s.name AS scenario_name
    FROM test_batteries tb
    LEFT JOIN test_battery_scenarios tbs ON tb.id = tbs.battery_id
    LEFT JOIN scenarios s ON tbs.scenario_id = s.id
    WHERE tb.archived = 1
  `; 
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const batteries = rows.reduce((acc, row) => {
        const battery = acc.find((b) => b.id === row.battery_id);
        if (battery) {
          battery.scenarios.push({
            id: row.scenario_id,
            name: row.scenario_name,
            status: row.status,
          });
        } else {
          acc.push({
            id: row.battery_id,
            name: row.battery_name,
            ticket_number: row.ticket_number,
            scenarios: row.scenario_id
              ? [
                  {
                    id: row.scenario_id,
                    name: row.scenario_name,
                    status: row.status,
                  },
                ]
              : [],
          });
        }
        return acc;
      }, []);
      res.json(batteries);
    }
  });
});

app.post('/api/generate-ia-scenarios', async (req, res) => {
  const { xml, format } = req.body;
  if (!xml) return res.status(400).json({ scenarios: 'XML não enviado.' });

  let prompt = '';
  if (format === 'gherkin') {
    prompt = `
Tens o seguinte ficheiro XML extraído de um ticket do Jira.
Gera todos os cenários de teste funcionais em formato Gherkin (Given-When-Then), claros e completos, usando apenas informação relevante (descrição, comentários, requisitos).
Ignora campos técnicos do XML que não descrevam comportamento funcional do pedido em inglês.
O XML é:
${xml}
`;
  } else {
    prompt = `
Tens o seguinte ficheiro XML extraído de um ticket do Jira.

A tua tarefa:
1. Extrai toda a informação relevante da descrição, comentários e épico (caso exista).
2. Decompõe o pedido funcional em TODOS os cenários de teste MANUAIS que garantam a cobertura funcional do que foi pedido para ser desenvolvido e assim o QA poder testar.
3. Inclui casos para cada funcionalidade do pedido escrito na descrição, comentários e épico (se existir). Cada cenário deve ser claro, completo e autónomo.
4. Em ingles.
5. Não agrupes tudo num só cenário! Identifica explicitamente cada funcionalidade do pedido e transforma-a num cenário distinto para QA.
6. “Only output an array of JSON objects, no preamble, no explanations. Each object should have: name, description, pre_conditions, steps, expected_results, tags.”

O XML do ticket é:
${xml}
`;
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4.1',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.5
    }, {
      headers: {
        Authorization: `Bearer ${process.env.IA_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    res.json({ scenarios: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ scenarios: 'Erro ao comunicar com a IA.' });
  }
});

// ==========================
// Inicialização do Servidor
// ==========================
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});