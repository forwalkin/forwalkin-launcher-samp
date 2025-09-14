const { contextBridge, ipcRenderer } = require("electron");                                                                                                                                                                                                                 
contextBridge.exposeInMainWorld("electronAPI", {
  selectGTAPath: () => ipcRenderer.invoke("selectGTAPath"),
  getConfig: () => ipcRenderer.invoke("getConfig"),
  connectServer: (ip, port) => ipcRenderer.invoke("connectServer", { ip, port }),
  queryServer: (ip, port) => ipcRenderer.invoke("queryServer", { ip, port })
});
