import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Remova ou comente a linha abaixo se não tiver um preload.js
      // preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Carrega a build do Vite (produção)
  win.loadFile(path.join(__dirname, 'dist/index.html')).catch((err) => {
    console.error('Erro ao carregar index.html:', err);
  });

  win.loadURL('http://localhost:8080').catch((err) => {
  console.error('Erro ao carregar URL:', err);
});
}

app.whenReady().then(() => {
  createWindow();
}).catch((err) => {
  console.error('Erro ao inicializar o Electron:', err);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});