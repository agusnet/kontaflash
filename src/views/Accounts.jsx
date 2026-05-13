import React, { useState, useEffect } from 'react';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [view, setView] = useState('list'); // 'list' o 'form'
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#16a34a');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const data = await window.api.query(`
      SELECT a.*, 
             (SELECT IFNULL(SUM(amount), 0) FROM operation WHERE account_id = a.id AND type_id = 1 AND status = 1) as total_income,
             (SELECT IFNULL(SUM(amount), 0) FROM operation WHERE account_id = a.id AND type_id = 2 AND status = 1) as total_expense
      FROM account a 
      ORDER BY a.name ASC
    `);
    
    const accountsWithBalance = data.map(acc => {
      const income = Number(acc.total_income) || 0;
      const expense = Number(acc.total_expense) || 0;
      return {
        ...acc,
        balance: income - expense
      };
    });

    setAccounts(accountsWithBalance);
  };

  const handleOpenForm = (acc = null) => {
    if (acc) {
      setEditingId(acc.id);
      setName(acc.name);
      setColor(acc.color || '#16a34a');
    } else {
      setEditingId(null);
      setName('');
      setColor('#16a34a');
    }
    setView('form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    
    if (editingId) {
      await window.api.execute('UPDATE account SET name = ?, color = ? WHERE id = ?', [name, color, editingId]);
    } else {
      await window.api.execute('INSERT INTO account (name, color) VALUES (?, ?)', [name, color]);
    }
    
    setName('');
    setView('list');
    loadAccounts();
  };

  const deleteAccount = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta cuenta?')) {
      await window.api.execute('DELETE FROM account WHERE id = ?', [id]);
      loadAccounts();
    }
  };

  if (view === 'form') {
    return (
      <div className="view-content animate-fade-in">
        <div className="view-header">
          <h3>{editingId ? 'Editar Cuenta' : 'Nueva Cuenta'}</h3>
          <md-text-button onClick={() => setView('list')}>
            <md-icon slot="icon">arrow_back</md-icon>
            Volver a la lista
          </md-text-button>
        </div>

        <div className="form-container" style={{maxWidth: '600px', background: '#fff', padding: '32px', borderRadius: '28px', border: '1px solid var(--md-surface-variant)'}}>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            <md-outlined-text-field
              label="Nombre de la Cuenta"
              value={name}
              onInput={(e) => setName(e.target.value)}
              placeholder="Ej. Caja General o Banco"
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
                {editingId ? 'Actualizar Cuenta' : 'Guardar Cuenta'}
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
        <p>Gestiona tus cuentas bancarias y de efectivo</p>
        <md-filled-button onClick={() => handleOpenForm()}>
          <md-icon slot="icon">account_balance_wallet</md-icon>
          Nueva Cuenta
        </md-filled-button>
      </div>

      <div className="data-grid">
        {accounts.map(acc => (
          <div key={acc.id} className="data-card account-card" style={{ borderLeft: `6px solid ${acc.color}` }}>
            <div className="card-info">
              <div className="card-title-row">
                <h4>{acc.name}</h4>
                <div className="card-actions">
                  <md-icon-button onClick={() => handleOpenForm(acc)}>
                    <md-icon>edit</md-icon>
                  </md-icon-button>
                  <md-icon-button onClick={() => deleteAccount(acc.id)}>
                    <md-icon>delete</md-icon>
                  </md-icon-button>
                </div>
              </div>
              <p className={`card-balance ${acc.balance >= 0 ? 'text-success' : 'text-danger'}`} style={{fontSize: '1.2rem', marginTop: '8px'}}>
                Saldo: <strong>${parseFloat(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accounts;
