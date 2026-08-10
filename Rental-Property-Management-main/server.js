const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.writeHead(200);
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(5000, () => {
    console.log('✅ Server running on http://localhost:5000');
    console.log('📁 Open this URL in your browser to see the project');
    console.log('🎨 Features: Vanta.js 3D background, modern UI, all pages working');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
});
