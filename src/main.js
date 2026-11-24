const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs/promises');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1120,
    height: 760,
    minWidth: 900,
    minHeight: 650,
    backgroundColor: '#071426',
    title: 'GameBoost Cleaner',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Escopo intencionalmente limitado: somente a pasta temporária do usuário.
function getSafeRoot() {
  return path.resolve(os.tmpdir());
}

async function walk(dir, root, result) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); }
  catch { return; }

  for (const entry of entries) {
    const full = path.resolve(dir, entry.name);
    if (!full.startsWith(root + path.sep)) continue;
    try {
      const stat = await fs.lstat(full);
      if (stat.isSymbolicLink()) continue; // nunca seguir links
      if (stat.isDirectory()) {
        await walk(full, root, result);
      } else if (stat.isFile()) {
        result.push({ path: full, size: stat.size });
      }
    } catch { /* arquivos em uso ou sem acesso são ignorados */ }
  }
}

async function scanTemp() {
  const root = getSafeRoot();
  const files = [];
  await walk(root, root, files);
  return {
    fileCount: files.length,
    totalBytes: files.reduce((sum, item) => sum + item.size, 0)
  };
}

ipcMain.handle('system:info', async () => ({
  platform: process.platform,
  username: os.userInfo().username,
  tempPath: getSafeRoot(),
  totalMemory: os.totalmem(),
  freeMemory: os.freemem()
}));

ipcMain.handle('cleanup:scan', async () => scanTemp());

ipcMain.handle('cleanup:run', async () => {
  const root = getSafeRoot();
  const files = [];
  await walk(root, root, files);

  const answer = await dialog.showMessageBox(mainWindow, {
    type: 'warning',
    buttons: ['Cancelar', 'Limpar arquivos temporários'],
    defaultId: 0,
    cancelId: 0,
    noLink: true,
    title: 'Confirmar limpeza',
    message: `Foram encontrados ${files.length} arquivos temporários.`,
    detail: 'Somente arquivos dentro da pasta TEMP do usuário serão removidos. Arquivos em uso ou sem permissão serão ignorados. Deseja continuar?'
  });
  if (answer.response !== 1) return { cancelled: true, deletedCount: 0, freedBytes: 0 };

  let deletedCount = 0;
  let freedBytes = 0;
  for (const item of files) {
    try {
      // Revalida o caminho imediatamente antes da exclusão.
      const resolved = path.resolve(item.path);
      if (!resolved.startsWith(root + path.sep)) continue;
      const stat = await fs.lstat(resolved);
      if (!stat.isFile() || stat.isSymbolicLink()) continue;
      await fs.unlink(resolved);
      deletedCount++;
      freedBytes += stat.size;
    } catch { /* arquivo bloqueado, já removido ou sem permissão */ }
  }
  return { cancelled: false, deletedCount, freedBytes };
});
