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

    // Csak a csatlakozott usernek küldi
    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome',
        createdAt: new Date().getTime()
    });

    // A csatlakozott useren kivül mindenkinek elküldi
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'new user joined',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        // IO.emit mindenkinek elküldi az üzenetet
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });

        // Broadcast mindenkinek elküldi kivéve aki küldte
        //socket.broadcast.emit('createMessage', {
        //        from: message.from,
        //        text: message.text,
        //        createdAt: new Date().getTime()
        //});
    });

    socket.on('disconnect', () => {
        console.log('USER DISCONNECTED');
    });
});

server.listen(port, () => {
    console.log('Started on port ' + port);
});