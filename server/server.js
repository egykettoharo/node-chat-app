const path      = require('path');
const http      = require('http');
const express   = require('express');
const socketIO  = require('socket.io');

const publicPath    = path.join(__dirname, '../public');
const port          = process.env.PORT || 3000;

//console.log(__dirname + '/../public');
//console.log(publicPath);
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('NEW USER CONNECTED');

    socket.on('disconnect', () => {
        console.log('USER DISCONNECTED');
    });
});

server.listen(port, () => {
    console.log('Started on port ' + port);
});