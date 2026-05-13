const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const crypto = require('crypto');

// Detect development mode natively
const isDev = !app.isPackaged;

// Database initialization
const dbPath = isDev 
  ? path.join(__dirname, '../kontaflash.db')
  : path.join(app.getPath('userData'), 'kontaflash.db');


const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('--- Database Error ---');
    console.error('Could not connect to database', err.message);
    console.error('----------------------');
  } else {
    console.log('Connected to the SQLite database.');
    initDatabase();
  }
});

// Helper for Promisified queries
const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Initialize database with schema if needed
function initDatabase() {
  try {
    const schemaPath = path.join(__dirname, '../schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.error('Schema file not found at:', schemaPath);
      return;
    }
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // sqlite3.exec can handle multiple statements
    db.exec(schema, async (err) => {
      if (err) {
        console.error('Error executing schema:', err.message);
      } else {
        console.log('--- Database Status ---');
        console.log('Path:', dbPath);
        
        // Verificar y forzar admin
        const crypto = require('crypto');
        const pass = 'admin';
        const md5 = crypto.createHash('md5').update(pass).digest('hex');
        const hashedPassword = crypto.createHash('sha1').update(md5).digest('hex');
        
        db.get("SELECT count(*) as total FROM user", (err, row) => {
          if (!err && row.total === 0) {
            db.run("INSERT OR REPLACE INTO user (id, name, username, password, status, is_admin) VALUES (?, ?, ?, ?, ?, ?)", 
              [1, 'Admin', 'admin', hashedPassword, 1, 1], (err) => {
                if (!err) console.log('Default Admin (id 1) ensured successfully.');
              });
          } else if (!err) {
            console.log('Users found in DB:', row.total);
            // Asegurar que el id 1 sea admin por si acaso
            db.run("INSERT OR REPLACE INTO user (id, name, username, password, status, is_admin) VALUES (?, ?, ?, ?, ?, ?)", 
              [1, 'Admin', 'admin', hashedPassword, 1, 1]);
          }
        });

        console.log('Initialization: SUCCESS');
        console.log('-----------------------');
      }
    });
  } catch (error) {
    console.error('Failed to read schema file:', error.message);
  }
}

// IPC Handlers
ipcMain.handle('db:query', async (event, { sql, params = [] }) => {
  try {
    return await dbQuery(sql, params);
  } catch (error) {
    console.error('DB Query Error:', error);
    throw error;
  }
});

ipcMain.handle('db:execute', async (event, { sql, params = [] }) => {
  try {
    return await dbRun(sql, params);
  } catch (error) {
    console.error('DB Execute Error:', error);
    throw error;
  }
});

ipcMain.handle('db:login', async (event, { username, password }) => {
  try {
    const crypto = require('crypto');
    const md5 = crypto.createHash('md5').update(password).digest('hex');
    const hashedPassword = crypto.createHash('sha1').update(md5).digest('hex');

    console.log('--- Login Attempt ---');
    console.log('Username:', username);
    console.log('Generated Hash:', hashedPassword);

    const user = await dbGet(
      'SELECT id, name, username, is_admin FROM user WHERE username = ? AND password = ? AND status = 1',
      [username, hashedPassword]
    );
    
    if (user) {
      console.log('Login Result: SUCCESS');
      console.log('User Data:', user);
    } else {
      console.log('Login Result: FAILED (User not found or password mismatch)');
      // Verificar si el usuario existe al menos por nombre
      const exists = await dbGet('SELECT * FROM user WHERE username = ?', [username]);
      if (exists) {
        console.log('Debug: User exists but password/status is wrong.');
        console.log('Stored password in DB:', exists.password);
      } else {
        console.log('Debug: User does not exist in DB.');
      }
    }
    console.log('---------------------');
    
    return user || null;
  } catch (error) {
    console.error('Login Handler Error:', error);
    return null;
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../public/vite.svg')
  });

  win.loadURL(
    isDev
      ? 'http://localhost:5180'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
