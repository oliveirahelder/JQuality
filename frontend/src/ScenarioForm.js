import React from 'react';

const ScenarioForm = ({ formData, onChange, onSubmit, editingId }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="name">Scenario Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name} // Vincula ao estado formData
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="description">Scenario Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description} // Vincula ao estado formData
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="pre_conditions">Pre-conditions:</label>
        <textarea
          id="pre_conditions"
          name="pre_conditions"
          value={formData.pre_conditions} // Vincula ao estado formData
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="steps">Steps:</label>
        <textarea
          id="steps"
          name="steps"
          value={formData.steps} // Vincula ao estado formData
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="expected_results">Expected Results:</label>
        <textarea
          id="expected_results"
          name="expected_results"
          value={formData.expected_results} // Vincula ao estado formData
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority} // Vincula ao estado formData
          onChange={onChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label htmlFor="tags">Tags:</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags} // Vincula ao estado formData
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status} // Vincula ao estado formData
          onChange={onChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button type="submit">{editingId ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default ScenarioForm;