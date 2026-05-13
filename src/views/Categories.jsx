import React, { useState, useEffect } from 'react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState('list'); // 'list' o 'form'
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#2563eb');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await window.api.getCategories();
    setCategories(data);
  };

  const handleOpenForm = (cat = null) => {
    if (cat) {
      setEditingId(cat.id);
      setName(cat.name);
      setColor(cat.color || '#2563eb');
    } else {
      setEditingId(null);
      setName('');
      setColor('#2563eb');
    }
    setView('form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    
    if (editingId) {
      await window.api.execute('UPDATE category SET name = ?, color = ? WHERE id = ?', [name, color, editingId]);
    } else {
      await window.api.execute('INSERT INTO category (name, color) VALUES (?, ?)', [name, color]);
    }
    
    setName('');
    setView('list');
    loadCategories();
  };

  const deleteCategory = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      await window.api.execute('DELETE FROM category WHERE id = ?', [id]);
      loadCategories();
    }
  };

  if (view === 'form') {
    return (
      <div className="view-content animate-fade-in">
        <div className="view-header">
          <h3>{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
          <md-text-button onClick={() => setView('list')}>
            <md-icon slot="icon">arrow_back</md-icon>
            Volver a la lista
          </md-text-button>
        </div>

        <div className="form-container" style={{maxWidth: '600px', background: '#fff', padding: '32px', borderRadius: '28px', border: '1px solid var(--md-surface-variant)'}}>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            <md-outlined-text-field
              label="Nombre de la categoría"
              value={name}
              onInput={(e) => setName(e.target.value)}
              required
            />
            
            <div className="form-group">
              <label style={{display: 'block', marginBottom: '8px', fontSize: '0.85rem'}}>Color Identificador</label>
              <input 
                type="color" 
                value={color} 
                style={{ width: '100%', height: '48px', border: 'none', borderRadius: '8px' }}
                onChange={(e) => setColor(e.target.value)} 
              />
            </div>

            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px'}}>
              <md-text-button type="button" onClick={() => setView('list')}>Cancelar</md-text-button>
              <md-filled-button type="submit">
                {editingId ? 'Actualizar Categoría' : 'Guardar Categoría'}
              </md-filled-button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="view-content animate-fade-in">
      <div className="view-header">
        <p>Administra las categorías de tus movimientos</p>
        <md-filled-button onClick={() => handleOpenForm()}>
          <md-icon slot="icon">add</md-icon>
          Nueva Categoría
        </md-filled-button>
      </div>

      <div className="data-grid">
        {categories.map(cat => (
          <div key={cat.id} className="data-card category-card" style={{ borderLeft: `6px solid ${cat.color}` }}>
            <div className="card-info">
              <h4>{cat.name}</h4>
              <p>ID: #{cat.id}</p>
            </div>
            <div className="card-actions">
              <md-icon-button onClick={() => handleOpenForm(cat)}>
                <md-icon>edit</md-icon>
              </md-icon-button>
              <md-icon-button onClick={() => deleteCategory(cat.id)}>
                <md-icon>delete</md-icon>
              </md-icon-button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
