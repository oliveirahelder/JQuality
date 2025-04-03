import React from 'react';

const ScenarioForm = ({ formData, onChange, onSubmit, editingId }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="tags">Tags:</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags || ''} // Adiciona tags
          onChange={onChange}
          placeholder="e.g., Login, Performance"
        />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
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