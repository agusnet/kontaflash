import React, { useState, useEffect } from 'react';
import { User, Mail, Phone } from 'lucide-react';

const Persons = () => {
  const [persons, setPersons] = useState([]);
  const [view, setView] = useState('list'); // 'list' o 'form'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    kind: '1',
    email: '',
    phone: ''
  });

  useEffect(() => {
    loadPersons();
  }, []);

  const loadPersons = async () => {
    const data = await window.api.query('SELECT * FROM person ORDER BY name ASC');
    setPersons(data);
  };

  const handleOpenForm = (p = null) => {
    if (p) {
      setEditingId(p.id);
      setFormData({
        name: p.name || '',
        lastname: p.lastname || '',
        kind: p.kind.toString(),
        email: p.email || '',
        phone: p.phone || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', lastname: '', kind: '1', email: '', phone: '' });
    }
    setView('form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, lastname, kind, email, phone } = formData;
    
    if (editingId) {
      await window.api.execute(
        'UPDATE person SET name = ?, lastname = ?, kind = ?, email = ?, phone = ? WHERE id = ?', 
        [name, lastname, kind, email, phone, editingId]
      );
    } else {
      await window.api.execute(
        'INSERT INTO person (name, lastname, kind, email, phone) VALUES (?, ?, ?, ?, ?)', 
        [name, lastname, kind, email, phone]
      );
    }
    
    setView('list');
    loadPersons();
  };

  const deletePerson = async (id) => {
    if (confirm('¿Estás seguro de eliminar a esta persona?')) {
      await window.api.execute('DELETE FROM person WHERE id = ?', [id]);
      loadPersons();
    }
  };

  const getKindLabel = (kind) => {
    switch (kind.toString()) {
      case '1': return <span className="badge badge-client">Cliente</span>;
      case '2': return <span className="badge badge-supplier">Proveedor</span>;
      case '3': return <span className="badge badge-contact">Contacto</span>;
      default: return 'Otro';
    }
  };

  if (view === 'form') {
    return (
      <div className="view-content animate-fade-in">
        <div className="view-header">
          <h3>{editingId ? 'Editar Persona' : 'Nueva Persona'}</h3>
          <md-text-button onClick={() => setView('list')}>
            <md-icon slot="icon">arrow_back</md-icon>
            Volver a la lista
          </md-text-button>
        </div>

        <div className="form-container" style={{maxWidth: '800px', background: '#fff', padding: '32px', borderRadius: '28px', border: '1px solid var(--md-surface-variant)'}}>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            <div className="form-row" style={{display: 'flex', gap: '16px'}}>
              <md-outlined-text-field
                label="Nombre"
                value={formData.name}
                onInput={(e) => setFormData({...formData, name: e.target.value})}
                required
                style={{flex: 1}}
              />
              <md-outlined-text-field
                label="Apellido"
                value={formData.lastname}
                onInput={(e) => setFormData({...formData, lastname: e.target.value})}
                style={{flex: 1}}
              />
            </div>

            <md-outlined-select
              label="Tipo de persona"
              value={formData.kind}
              onInput={(e) => setFormData({...formData, kind: e.target.value})}
            >
              <md-select-option value="1"><div slot="headline">Cliente</div></md-select-option>
              <md-select-option value="2"><div slot="headline">Proveedor</div></md-select-option>
              <md-select-option value="3"><div slot="headline">Contacto</div></md-select-option>
            </md-outlined-select>

            <md-outlined-text-field
              label="Email"
              type="email"
              value={formData.email}
              onInput={(e) => setFormData({...formData, email: e.target.value})}
            >
              <md-icon slot="leading-icon">mail</md-icon>
            </md-outlined-text-field>

            <md-outlined-text-field
              label="Teléfono"
              value={formData.phone}
              onInput={(e) => setFormData({...formData, phone: e.target.value})}
            >
              <md-icon slot="leading-icon">phone</md-icon>
            </md-outlined-text-field>

            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px'}}>
              <md-text-button type="button" onClick={() => setView('list')}>Cancelar</md-text-button>
              <md-filled-button type="submit">
                {editingId ? 'Actualizar Persona' : 'Guardar Persona'}
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
        <p>Gestiona tus clientes, proveedores y contactos</p>
        <md-filled-button onClick={() => handleOpenForm()}>
          <md-icon slot="icon">person_add</md-icon>
          Nueva Persona
        </md-filled-button>
      </div>

      <div className="data-grid">
        {persons.map(p => (
          <div key={p.id} className="data-card person-card">
            <div className="card-title-row">
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <div className="person-avatar" style={{background: 'var(--md-primary-container)', padding: '8px', borderRadius: '12px'}}>
                  <User size={24} color="var(--md-on-primary-container)" />
                </div>
                <h4>{p.name} {p.lastname}</h4>
              </div>
              {getKindLabel(p.kind)}
            </div>
            <div className="card-details" style={{margin: '12px 0', color: 'var(--md-on-surface-variant)', fontSize: '0.9rem'}}>
              {p.email && <p style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Mail size={14} /> {p.email}</p>}
              {p.phone && <p style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Phone size={14} /> {p.phone}</p>}
            </div>
            <div className="card-actions" style={{justifyContent: 'flex-end'}}>
              <md-icon-button onClick={() => handleOpenForm(p)}>
                <md-icon>edit</md-icon>
              </md-icon-button>
              <md-icon-button onClick={() => deletePerson(p.id)}>
                <md-icon>delete</md-icon>
              </md-icon-button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Persons;
