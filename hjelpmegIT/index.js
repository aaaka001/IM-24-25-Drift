const http = require('http');
const fs = require('fs');
const path = require('path');

const publicFolder = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
    let filePath = path.join(publicFolder, req.url === '/' ? 'index.html' : req.url);
    
    // Prevent directory traversal attacks
    if (!filePath.startsWith(publicFolder)) {
        res.writeHead(403);
        return res.end('Access denied');
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            let ext = path.extname(filePath).toLowerCase();
            let contentType = 'text/html';

            // Set proper content type
            const mimeTypes = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'text/javascript',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
            };

            if (mimeTypes[ext]) {
                contentType = mimeTypes[ext];
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(3000, () => {
    console.log('Server kjører på http://localhost:3000');
});
