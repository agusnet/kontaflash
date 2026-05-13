import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Search } from 'lucide-react';

const Operations = () => {
  const [operations, setOperations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [persons, setPersons] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [view, setView] = useState('list'); // 'list' o 'form'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type_id: '1',
    category_id: '',
    person_id: '',
    account_id: '',
    operation_at: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const ops = await window.api.query(`
      SELECT o.*, c.name as category_name, c.color as category_color, 
             p.name as person_name, p.lastname as person_lastname,
             a.name as account_name, a.color as account_color
      FROM operation o
      LEFT JOIN category c ON o.category_id = c.id
      LEFT JOIN person p ON o.person_id = p.id
      LEFT JOIN account a ON o.account_id = a.id
      ORDER BY o.operation_at DESC, o.created_at DESC
    `);
    const cats = await window.api.getCategories();
    const pers = await window.api.query('SELECT * FROM person');
    const accs = await window.api.getAccounts();
    
    setOperations(ops);
    setCategories(cats);
    setPersons(pers);
    setAccounts(accs);
  };

  const handleOpenForm = (op = null) => {
    if (op) {
      setEditingId(op.id);
      setFormData({
        description: op.description || '',
        amount: op.amount || '',
        type_id: op.type_id.toString(),
        category_id: op.category_id ? op.category_id.toString() : '',
        person_id: op.person_id ? op.person_id.toString() : '',
        account_id: op.account_id ? op.account_id.toString() : '',
        operation_at: op.operation_at
      });
    } else {
      setEditingId(null);
      setFormData({
        description: '',
        amount: '',
        type_id: '1',
        category_id: '',
        person_id: '',
        account_id: '',
        operation_at: new Date().toISOString().split('T')[0]
      });
    }
    setView('form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { description, amount, type_id, category_id, person_id, account_id, operation_at } = formData;
    
    if (editingId) {
      await window.api.execute(
        'UPDATE operation SET description = ?, amount = ?, type_id = ?, category_id = ?, person_id = ?, account_id = ?, operation_at = ? WHERE id = ?',
        [description, amount, type_id, category_id || null, person_id || null, account_id || null, operation_at, editingId]
      );
    } else {
      await window.api.execute(
        'INSERT INTO operation (description, amount, type_id, category_id, person_id, account_id, operation_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, 1)', 
        [description, amount, type_id, category_id || null, person_id || null, account_id || null, operation_at]
      );
    }
    
    setView('list');
    loadData();
  };

  const deleteOperation = async (id) => {
    if (confirm('¿Deseas eliminar esta operación?')) {
      await window.api.execute('DELETE FROM operation WHERE id = ?', [id]);
      loadData();
    }
  };

  if (view === 'form') {
    return (
      <div className="view-content animate-fade-in">
        <div className="view-header">
          <h3>{editingId ? 'Editar Movimiento' : 'Registrar Movimiento'}</h3>
          <md-text-button onClick={() => setView('list')}>
            <md-icon slot="icon">arrow_back</md-icon>
            Volver a la lista
          </md-text-button>
        </div>

        <div className="form-container" style={{maxWidth: '800px', background: '#fff', padding: '32px', borderRadius: '28px', border: '1px solid var(--md-surface-variant)'}}>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            <div className="form-group">
              <label style={{display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: '500'}}>Tipo de Operación</label>
              <div style={{display: 'flex', gap: '16px'}}>
                <md-filled-button 
                  type="button" 
                  onClick={() => setFormData({...formData, type_id: '1'})}
                  style={{
                    flex: 1, 
                    '--md-filled-button-container-color': formData.type_id === '1' ? 'var(--md-success)' : 'var(--md-surface-variant)',
                    '--md-filled-button-label-text-color': formData.type_id === '1' ? '#fff' : 'var(--md-on-surface-variant)'
                  }}
                >
                  <md-icon slot="icon">add_circle</md-icon>
                  Ingreso
                </md-filled-button>
                <md-filled-button 
                  type="button" 
                  onClick={() => setFormData({...formData, type_id: '2'})}
                  style={{
                    flex: 1, 
                    '--md-filled-button-container-color': formData.type_id === '2' ? 'var(--md-error)' : 'var(--md-surface-variant)',
                    '--md-filled-button-label-text-color': formData.type_id === '2' ? '#fff' : 'var(--md-on-surface-variant)'
                  }}
                >
                  <md-icon slot="icon">remove_circle</md-icon>
                  Egreso
                </md-filled-button>
              </div>
            </div>

            <md-outlined-text-field
              label="Descripción"
              value={formData.description}
              onInput={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Ej. Pago de nómina"
              required
            />

            <div className="form-row" style={{display: 'flex', gap: '16px'}}>
              <md-outlined-text-field
                label="Monto"
                type="number"
                value={formData.amount}
                onInput={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
                required
                style={{flex: 1}}
              />
              <md-outlined-text-field
                label="Fecha"
                type="date"
                value={formData.operation_at}
                onInput={(e) => setFormData({...formData, operation_at: e.target.value})}
                required
                style={{flex: 1}}
              />
            </div>

            <div className="form-row" style={{display: 'flex', gap: '16px'}}>
              <md-outlined-select
                label="Categoría"
                value={formData.category_id}
                onInput={(e) => setFormData({...formData, category_id: e.target.value})}
                style={{flex: 1}}
              >
                <md-select-option value=""><div slot="headline">Ninguna</div></md-select-option>
                {categories.map(c => <md-select-option key={c.id} value={c.id.toString()}><div slot="headline">{c.name}</div></md-select-option>)}
              </md-outlined-select>

              <md-outlined-select
                label="Persona"
                value={formData.person_id}
                onInput={(e) => setFormData({...formData, person_id: e.target.value})}
                style={{flex: 1}}
              >
                <md-select-option value=""><div slot="headline">Ninguna</div></md-select-option>
                {persons.map(p => <md-select-option key={p.id} value={p.id.toString()}><div slot="headline">{p.name} {p.lastname}</div></md-select-option>)}
              </md-outlined-select>
            </div>

            <md-outlined-select
              label="Cuenta"
              value={formData.account_id}
              onInput={(e) => setFormData({...formData, account_id: e.target.value})}
            >
              <md-select-option value=""><div slot="headline">Ninguna</div></md-select-option>
              {accounts.map(a => <md-select-option key={a.id} value={a.id.toString()}><div slot="headline">{a.name}</div></md-select-option>)}
            </md-outlined-select>

            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px'}}>
              <md-text-button type="button" onClick={() => setView('list')}>Cancelar</md-text-button>
              <md-filled-button type="submit">
                {editingId ? 'Actualizar Movimiento' : 'Guardar Movimiento'}
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
        <div className="search-bar" style={{maxWidth: '300px'}}>
          <Search size={18} />
          <input type="text" placeholder="Buscar..." />
        </div>
        <md-filled-button onClick={() => handleOpenForm()}>
          <md-icon slot="icon">add</md-icon>
          Nueva Operación
        </md-filled-button>
      </div>

      <div className="table-container" style={{marginTop: '20px'}}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Persona</th>
              <th>Cuenta</th>
              <th className="text-right">Monto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {operations.map(op => (
              <tr key={op.id}>
                <td>{op.operation_at}</td>
                <td>
                  <div className="op-desc" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    {op.type_id === 1 ? 
                      <ArrowUpCircle size={16} className="text-success" /> : 
                      <ArrowDownCircle size={16} className="text-danger" />
                    }
                    {op.description}
                  </div>
                </td>
                <td>
                  {op.category_name && (
                    <span className="cat-tag" style={{ borderLeft: `4px solid ${op.category_color}`, paddingLeft: '8px' }}>
                      {op.category_name}
                    </span>
                  )}
                </td>
                <td>{op.person_name} {op.person_lastname}</td>
                <td>
                  {op.account_name && (
                    <div className="acc-mini-tag" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                       <md-icon style={{fontSize: '14px', color: op.account_color}}>account_balance</md-icon> {op.account_name}
                    </div>
                  )}
                </td>
                <td className={`text-right font-bold ${op.type_id === 1 ? 'text-success' : 'text-danger'}`}>
                  {op.type_id === 1 ? '+' : '-'}${parseFloat(op.amount).toFixed(2)}
                </td>
                <td>
                  <div className="card-actions" style={{display: 'flex', gap: '4px'}}>
                    <md-icon-button onClick={() => handleOpenForm(op)}>
                      <md-icon>edit</md-icon>
                    </md-icon-button>
                    <md-icon-button onClick={() => deleteOperation(op.id)}>
                      <md-icon>delete</md-icon>
                    </md-icon-button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Operations;
