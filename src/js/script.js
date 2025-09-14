// Configuraçao
document.getElementById("config").addEventListener("click", async () => {
  let res = await window.electronAPI.selectGTAPath();
  if (res?.error) alert(res.error);
  else if (res?.gtaPath) alert("Pasta salva: " + res.gtaPath);
});

// Atualizar servidores
async function loadServers() {
  let srv1 = await window.electronAPI.queryServer("198.50.176.8", 7777);
  if (srv1.online) {
    document.getElementById("srv1-name").innerText = srv1.hostname;
    document.getElementById("srv1-players").innerText = srv1.players + "/" + srv1.maxplayers;
  } else {
    document.getElementById("srv1-name").innerText = "Servidor 1 offline";
    document.getElementById("srv1-players").innerText = "";
  }

  let srv2 = await window.electronAPI.queryServer("66.70.157.103", 7777);
  if (srv2.online) {
    document.getElementById("srv2-name").innerText = srv2.hostname;
    document.getElementById("srv2-players").innerText = srv2.players + "/" + srv2.maxplayers;
  } else {
    document.getElementById("srv2-name").innerText = "Servidor 2 offline";
    document.getElementById("srv2-players").innerText = "";
  }
}

loadServers();

// Conectar
document.getElementById("srv1-connect").addEventListener("click", async () => {
  let res = await window.electronAPI.connectServer("198.50.176.8", 7777);
  if (res?.error) alert(res.error);
});

document.getElementById("srv2-connect").addEventListener("click", async () => {
  let res = await window.electronAPI.connectServer("66.70.157.103", 7777);
  if (res?.error) alert(res.error);
});
