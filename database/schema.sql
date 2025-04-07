-- Placeholder for database schema
-- Tables for scenarios, test runs, and Jira ticket mappings will be added here.

CREATE TABLE scenarios (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  pre_conditions TEXT,
  steps TEXT,
  expected_results TEXT,
  priority TEXT,
  status VARCHAR(50) DEFAULT 'active',
  tags TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_batteries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  ticket_number TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_battery_scenarios (
  battery_id INTEGER,
  scenario_id INTEGER,
  FOREIGN KEY (battery_id) REFERENCES test_batteries(id),
  FOREIGN KEY (scenario_id) REFERENCES scenarios(id)
);