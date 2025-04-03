-- Placeholder for database schema
-- Tables for scenarios, test runs, and Jira ticket mappings will be added here.

CREATE TABLE scenarios (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  tags TEXT, -- Adiciona a coluna para armazenar tags
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);