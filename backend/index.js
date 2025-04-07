const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

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
      status TEXT DEFAULT 'active',
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
        const placeholders = scenario_ids.map(() => '(?, ?)').join(',');
        const query = `INSERT INTO test_battery_scenarios (battery_id, scenario_id) VALUES ${placeholders}`;
        const params = scenario_ids.flatMap((id) => [batteryId, id]);
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

// ==========================
// Inicialização do Servidor
// ==========================
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});