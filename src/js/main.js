const { app, BrowserWindow, ipcMain, dialog } = require("electron"); 
const path = require("path"); 
const fs = require("fs");


const { spawn } = require("child_process");
const query = require("samp-query");


let configPath = path.join(__dirname, "config.json");


if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify({ gtaPath: "" }, null, 2));
}


function createWindow() {
  const win = new BrowserWindow({
    width: 1000,               
    height: 800,               
    resizable: false,          
    webPreferences: {
      preload: path.join(__dirname, "preload.js") 
    }
  });

 
  win.loadFile(path.join(__dirname, "../renderer/index.html"));
}


app.whenReady().then(() => {
  createWindow();
});

// Handler para selecionar a pasta do GTA
ipcMain.handle("selectGTAPath", async () => {
  // Abre um dialogo para o usuário escolher uma pasta
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"]
  });

  if (result.canceled) return null;

  // Pega o caminho da pasta selecionada
  const folder = result.filePaths[0];

  // Caminho completo do samp.exe dentro da pasta selecionada
  const sampExe = path.join(folder, "samp.exe");

  // Verifica se o samp.exe existe
  if (!fs.existsSync(sampExe)) {
    return { error: "samp.exe não encontrado nessa pasta." };
  }

  // Salva o caminho do GTA no arquivo de configuração
  fs.writeFileSync(configPath, JSON.stringify({ gtaPath: folder }, null, 2));

  // Retorna o caminho selecionado
  return { gtaPath: folder };
});

// Handler para obter a configuração atual do launcher
ipcMain.handle("getConfig", () => {
  return JSON.parse(fs.readFileSync(configPath));
});

// Handler para conectar a um servidor SA-MP
ipcMain.handle("connectServer", (event, { ip, port }) => {
  const cfg = JSON.parse(fs.readFileSync(configPath)); // Lê o config
  if (!cfg.gtaPath) {
    return { error: "Configure o local do GTA primeiro!" };
  }

  // Caminho completo do executável
  const exe = path.join(cfg.gtaPath, "samp.exe");
  if (!fs.existsSync(exe)) {
    return { error: "samp.exe não encontrado na pasta configurada!" };
  }

  spawn(exe, [`${ip}:${port}`], { cwd: cfg.gtaPath });
  return { ok: true };
});

// Handler para consultar informações de um servidor SA-MP
ipcMain.handle("queryServer", async (event, { ip, port }) => {
  return new Promise((resolve) => {
    query({ host: ip, port }, (error, response) => {
      if (error) {
        resolve({ online: false }); // Servidor offline ou erro
      } else {
        resolve({
          online: true,                    
          hostname: response.hostname,     
          players: response.online,        
          maxplayers: response.maxplayers  
        });
      }
    });
  });
});
