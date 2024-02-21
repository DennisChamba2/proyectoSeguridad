const WebSocket = require('ws');
const https = require('https');
const express = require('express');
const path = require('path');
const fs = require('fs');


const app = express();

// SSL credentials
const server = https.createServer({
    cert: fs.readFileSync(path.join(__dirname,'../secrets/cert.pem')),
    key: fs.readFileSync(path.join(__dirname,'../secrets/key.pem'))
  }, app);
  

// const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log(message);
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

app.use(express.static(path.join(__dirname, '../public/views')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/views", 'chat.hbs'));
});

server.listen(3000, () => {
    console.log('Servidor WebSocket en ejecución en el puerto 3000');
});
