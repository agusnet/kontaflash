import React, { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.api) {
      setError('Error: Ejecuta la app con "npm run electron"');
      return;
    }
    try {
      const user = await window.api.login({ username, password });
      if (user) {
        onLogin(user);
      } else {
        setError('Credenciales incorrectas o usuario inactivo');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Error de conexión con la base de datos');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card animate-fade-in">
        <div className="login-header">
          <div className="logo-icon">
            <ShieldCheck size={32} color="var(--md-on-primary-container)" />
          </div>
          <h1>KontaFlash</h1>
          <p>Gestiona tus finanzas con Material 3</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <md-outlined-text-field
            label="Nombre de usuario"
            value={username}
            onInput={(e) => setUsername(e.target.value)}
            required
          >
            <md-icon slot="leading-icon">person</md-icon>
          </md-outlined-text-field>

          <md-outlined-text-field
            label="Contraseña"
            type="password"
            value={password}
            onInput={(e) => setPassword(e.target.value)}
            required
          >
            <md-icon slot="leading-icon">lock</md-icon>
          </md-outlined-text-field>

          {error && <div className="login-error">{error}</div>}

          <md-filled-button type="submit" style={{marginTop: '16px'}}>
            Ingresar <ArrowRight size={18} slot="icon" />
          </md-filled-button>
        </form>

        <div className="login-footer">
          <p>¿Olvidaste tu contraseña? <a href="#">Contacta al administrador</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
