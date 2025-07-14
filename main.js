import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true, // Mantém a barra de navegação padrão
    maximizable: true, // Desativa o botão maximizar
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // preload: path.join(__dirname, 'preload.js'), // Comente se não estiver usando
    },
  });

  win.loadFile(path.join(__dirname, 'dist/index.html')).catch((err) => {
    console.error('Erro ao carregar index.html:', err);
  });

  // Para desenvolvimento (comentar em produção)
   win.loadURL('http://localhost:8080').catch((err) => {
     console.error('Erro ao carregar URL:', err);
   });

  // Desativa o menu padrão
  Menu.setApplicationMenu(null);
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