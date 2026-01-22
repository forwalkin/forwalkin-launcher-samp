# SA-MP Launcher

Um launcher simples e funcional para **SA-MP**, desenvolvido em Electron.

## Como usar

1. Instale as dependências:

```bash
npm install electron
npm install samp-query
```

2. edite o `package.json`:

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
