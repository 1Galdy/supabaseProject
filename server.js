const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Si on demande la racine, servir login.html
  let filePath = req.url === '/' ? '/login.html' : req.url;
  filePath = path.join(__dirname, filePath);

  // Lire et servir le fichier
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Fichier non trouvé');
      return;
    }
    
    // Déterminer le type de contenu
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.js') contentType = 'application/javascript';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});