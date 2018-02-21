const path      = require('path');
const http      = require('http');
const express   = require('express');
const socketIO  = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./Utils/message.js');
const {isRealString} = require('./Utils/validation.js');
const {Users}        = require('./Utils/users.js');
const publicPath     = path.join(__dirname, '../public');
const port           = process.env.PORT || 3000;

//console.log(__dirname + '/../public');
//console.log(publicPath);
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('NEW USER CONNECTED');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room are required.');
        }

        socket.join(params.room);
        // socket.leave('room name);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // Csak a csatlakozott usernek küldi
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));

        // A csatlakozott useren kivül mindenkinek elküldi
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', params.name + ' has joined'));

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            // IO.emit mindenkinek elküldi az üzenetet
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        // Event acknowledgment
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);

        if (user) { 
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        console.log('USER DISCONNECTED');
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', user.name + ' has left the chat.'));
        }
    });
});

server.listen(port, () => {
    console.log('Started on port ' + port);
});

// Broadcast mindenkinek elküldi kivéve aki küldte
//socket.broadcast.emit('createMessage', {
//        from: message.from,
//        text: message.text,
//        createdAt: new Date().getTime()
//});