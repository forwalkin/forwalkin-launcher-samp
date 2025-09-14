const query = require("samp-query");

function getServerInfo(host, port) {
  return new Promise((resolve, reject) => {
    query({ host, port }, (error, response) => {
      if (error) return reject(error);
      resolve(response);
    });
  });
}

module.exports = { getServerInfo };
