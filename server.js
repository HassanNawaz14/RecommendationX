const http = require('http');
const fs = require('fs');
const path = require('path');
const { readRatings, writeRatings } = require('./fsUtils');

const TMDB_KEY = process.env.TMDB_KEY || 'c23620ab85823d1ee2c4f18c55fa38f7';

const PORT = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json'
};

const publicPath = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {

  const https = require('https');

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/api/movies')) {
      const urlObj = new URL(req.url, `http://${req.headers.host}`);
      const page = urlObj.searchParams.get('page') || 1;

      const tmdbUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&page=${page}`;
      https.get(tmdbUrl, (tmdbRes) => {
          let data = '';
          tmdbRes.on('data', chunk => data += chunk);
          tmdbRes.on('end', () => {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(data);
          });
      }).on('error', err => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'TMDb request failed' }));
      });
      return;
  }


  if (req.method === 'GET') {
    // Serving ratings.json
    if (req.url === '/ratings.json') {
      const ratings = readRatings();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(ratings));
      return;
    }

    // Serve static files (index.html, script.js, etc.)
    let filePath;
    if (req.url === '/') {
      filePath = path.join(publicPath, 'index.html');
    } else if (path.extname(req.url) === '') {
      // No extension — assume it's an HTML file
      filePath = path.join(publicPath, req.url + '.html');
    } else {
      // Has extension — serve as-is
      filePath = path.join(publicPath, req.url);
    }
    
    let extname = path.extname(filePath);
    let contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });

  } else if (req.method === 'POST' && req.url === '/submit') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { username, ratings } = JSON.parse(body);
        const data = readRatings();
        data.users.push({ username, ratings });
        writeRatings(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Ratings saved successfully' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid data format' }));
      }
    });
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
