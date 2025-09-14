# SA-MP Launcher

Um launcher simples e funcional para **SA-MP**, desenvolvido em Electron.

## Funcionalidades

* Atualizar a lista de servidores
* Ver status de cada servidor (online/offline)

## Como usar

1. Clone este repositório:

```bash
git clone https://github.com/seu-usuario/nlcanal-launcher.git
```

2. Instale as dependências:

```bash
npm install
npm install electron
npm install samp-query
```

3. Inicialize o `package.json` e edite para ficar assim:

```bash
npm init -y
```

```json
{
  "name": "samp-launcher",
  "version": "1.0.0",
  "main": "src/js/main.js",
  "scripts": {
    "start": "electron ."
  },
  "dependencies": {
    "samp-query": "^0.1.5",
    "electron-store": "^8.1.0"
  },
  "devDependencies": {
    "electron": "^30.0.0"
  }
}
```

4. Inicie o launcher:

```bash
npm start
```

---
