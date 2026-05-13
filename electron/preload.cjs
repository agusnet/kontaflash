const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Authentication
  login: (credentials) => ipcRenderer.invoke('db:login', credentials),
  
  // Generic DB methods
  query: (sql, params) => ipcRenderer.invoke('db:query', { sql, params }),
  execute: (sql, params) => ipcRenderer.invoke('db:execute', { sql, params }),
  
  // Specific methods can be added here
  getCategories: () => ipcRenderer.invoke('db:query', { sql: 'SELECT * FROM category ORDER BY name' }),
  getAccounts: () => ipcRenderer.invoke('db:query', { sql: 'SELECT * FROM account ORDER BY name' }),
});
