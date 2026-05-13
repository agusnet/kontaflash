import React, { useState, useEffect } from 'react';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Categories from './views/Categories';
import Persons from './views/Persons';
import Operations from './views/Operations';
import Accounts from './views/Accounts';
import { LayoutDashboard, Users, FolderTree, Landmark, History, LogOut } from 'lucide-react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'operations': return <Operations />;
      case 'persons': return <Persons />;
      case 'categories': return <Categories />;
      case 'accounts': return <Accounts />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-small">KF</div>
          <span>KontaFlash</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            onClick={() => setActiveView('dashboard')} 
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveView('operations')} 
            className={`nav-item ${activeView === 'operations' ? 'active' : ''}`}
          >
            <History size={20} /> Operaciones
          </button>
          <button 
            onClick={() => setActiveView('persons')} 
            className={`nav-item ${activeView === 'persons' ? 'active' : ''}`}
          >
            <Users size={20} /> Personas
          </button>
          <button 
            onClick={() => setActiveView('categories')} 
            className={`nav-item ${activeView === 'categories' ? 'active' : ''}`}
          >
            <FolderTree size={20} /> Categorías
          </button>
          <button 
            onClick={() => setActiveView('accounts')} 
            className={`nav-item ${activeView === 'accounts' ? 'active' : ''}`}
          >
            <Landmark size={20} /> Cuentas
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <div className="header-title">
            <h2>{activeView === 'accounts' ? 'Cuentas' : activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h2>
          </div>
          <div className="user-profile">
            <span>Bienvenido, <strong>{user.username}</strong></span>
          </div>
        </header>

        <div className="view-container">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;
