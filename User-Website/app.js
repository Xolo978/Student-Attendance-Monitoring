const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8090; // Fixed port for local development
const host = '0.0.0.0'; // Bind to localhost for local dev
const rootDir = path.join(__dirname, 'pages'); // Directory for HTML files
const scriptsDir = path.join(__dirname, 'scripts'); // Directory for JS files
const stylesDir = path.join(__dirname, 'styles'); // Directory for CSS files
const configDir = path.join(__dirname, 'config'); // Directory for config (like whitelisted.json)

const server = http.createServer((req, res) => {
    let filePath;

    // Route the request based on the URL
    if (req.url === '/') {
        filePath = path.join(rootDir, 'user-login.html'); // Serve user-login.html for root
    } else if (req.url.startsWith('/scripts/')) {
        filePath = path.join(__dirname, req.url); // Serve JS from the scripts folder
    } else if (req.url.startsWith('/styles/')) {
        filePath = path.join(__dirname, req.url); // Serve CSS from the styles folder
    } else if (req.url.startsWith('/config/')) {
        filePath = path.join(__dirname, req.url); // Serve JSON config
    }
    else if (req.url.startsWith('/static/')) {
        filePath = path.join(__dirname, req.url); // Serve JSON config
    }
     else {
        filePath = path.join(rootDir, req.url); // Serve other HTML pages from the pages folder
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';

    // Set the content type based on file extension
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            break;
    }

    // Serve the requested file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // If file not found, serve a 404 page
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404 - Not Found', 'utf-8');
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Serve the file with the correct content type
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});
