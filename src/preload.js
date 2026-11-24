const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('gameboost', {
  getSystemInfo: () => ipcRenderer.invoke('system:info'),
  scanTemp: () => ipcRenderer.invoke('cleanup:scan'),
  cleanTemp: () => ipcRenderer.invoke('cleanup:run')
});
