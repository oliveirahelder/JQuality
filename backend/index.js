const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Configuração do banco de dados SQLite
const db = new sqlite3.Database('./jquality.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criar tabela se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Rota principal do backend
app.get('/', (req, res) => {
  res.send('Welcome to JQuality Backend!');
});

// Rota para listar cenários
app.get('/api/scenarios', (req, res) => {
  db.all('SELECT * FROM scenarios', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Rota para buscar um cenário específico pelo ID
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

// Rota para criar um novo cenário
app.post('/api/scenarios', (req, res) => {
  const { name, description } = req.body;
  const query = 'INSERT INTO scenarios (name, description) VALUES (?, ?)';
  db.run(query, [name, description], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: this.lastID, name, description, status: 'active' });
    }
  });
});

// Rota para editar um cenário
app.put('/api/scenarios/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;
  console.log('Dados recebidos para atualização:', { id, name, description, status });
  const query = `
    UPDATE scenarios
    SET name = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  db.run(query, [name, description, status, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: 'Scenario not found' });
    } else {
      res.json({ id, name, description, status });
    }
  });
});

// Rota para excluir um cenário
app.delete('/api/scenarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM scenarios WHERE id = ?';
  db.run(query, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: 'Scenario not found' });
    } else {
      res.status(204).send();
    } if (this.changes > 0) {
      // Cenário excluído com sucesso             
      console.log('Cenário excluído com sucesso:', id);
    }
    
  });
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});