const fs = require('fs');
const localtunnel = require('localtunnel');

const PORT = 5173;
const SUBDOMAIN = 'bek-portal';

(async () => {
  try {
    const tunnel = await localtunnel({ port: PORT, subdomain: SUBDOMAIN });
    const url = tunnel.url;
    fs.writeFileSync(__dirname + '/tunnel_url.log', url, 'utf8');
    console.log(url);
  } catch (err) {
    fs.writeFileSync(__dirname + '/tunnel_url.log', 'ERROR: ' + err.message, 'utf8');
    console.error('Tunnel failed:', err.message);
  }
})();

setInterval(() => {}, 1 << 30);
