import React, { useState, useEffect } from 'react';
import { History } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });

  useEffect(() => {
    // Load real stats from DB
    const loadStats = async () => {
      try {
        const income = await window.api.query('SELECT SUM(amount) as total FROM operation WHERE type_id = 1 AND status = 1');
        const expense = await window.api.query('SELECT SUM(amount) as total FROM operation WHERE type_id = 2 AND status = 1');
        
        const inc = income[0]?.total || 0;
        const exp = expense[0]?.total || 0;
        
        setStats({
          income: inc,
          expense: exp,
          balance: inc - exp
        });
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="dashboard-content">
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Ingresos</span>
          <span className="stat-value text-success">${stats.income.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Egresos</span>
          <span className="stat-value text-danger">${stats.expense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Balance</span>
          <span className="stat-value">${stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="recent-operations">
        <h3>Operaciones Recientes</h3>
        <div className="empty-state">
          <History size={48} className="empty-icon" />
          <p>No hay operaciones recientes para mostrar.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
