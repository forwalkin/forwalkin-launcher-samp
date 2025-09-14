// Importa os módulos necessários do Electron
const { app, BrowserWindow, ipcMain, dialog } = require("electron");

// Importa o módulo 'path' para manipulação de caminhos de arquivos
const path = require("path");

// Importa o módulo 'fs' para manipulação de arquivos
const fs = require("fs");

// Importa o 'spawn' para executar processos externos (como o samp.exe)
const { spawn } = require("child_process");

// Importa o módulo 'samp-query' para consultar informações de servidores SA-MP
const query = require("samp-query");

// Define o caminho do arquivo de configuração do launcher
let configPath = path.join(__dirname, "config.json");

// Verifica se o arquivo de configuração existe, se não, cria um com valor padrão
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify({ gtaPath: "" }, null, 2));
}

// Função para criar a janela principal do Electron
function createWindow() {
  const win = new BrowserWindow({
    width: 1000,               // Largura da janela
    height: 800,               // Altura da janela
    resizable: false,          // Impede redimensionamento
    webPreferences: {
      preload: path.join(__dirname, "preload.js") // Arquivo preload para comunicação entre renderer e main
    }
  });

  // Carrega o arquivo HTML principal na janela
  win.loadFile(path.join(__dirname, "../renderer/index.html"));
}

// Cria a janela quando o app estiver pronto
app.whenReady().then(() => {
  createWindow();
});

// Handler para selecionar a pasta do GTA
ipcMain.handle("selectGTAPath", async () => {
  // Abre um diálogo para o usuário escolher uma pasta
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"]
  });

  // Se o usuário cancelar, retorna null
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

  // Executa o samp.exe com o argumento IP:PORT
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
          online: true,                    // Servidor online
          hostname: response.hostname,     // Nome do servidor
          players: response.online,        // Jogadores online
          maxplayers: response.maxplayers  // Máximo de jogadores
        });
      }
    });
  });
});
