var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var users = [];

io.on('connection', function (socket) {
    io.emit('users', users);
    console.log('a user open the html');
    console.log(users);
    let userName = '';
    socket.on('disconnect', function () {
        console.log(userName + '  disconnected');
        if (userName) {
            users.splice(users.indexOf(userName), 1);
            io.emit('users', users);
            console.log(users)
        }
    });

    socket.on('login', function (user) {
        arr = socket.handshake.address.toString().split(":");
        console.log(arr[arr.length - 1]);
        console.log('socket.id： ' + socket.id);
        console.log('user: ' + user);
        userName = user;
        users.push(user);
        console.log(users);
        io.emit('users', users);
    });

    socket.on('chat message', function (msg) {
        console.log(userName + ': ' + msg);
        new_msg = {
            nickname: userName,
            msg: msg
        };
        io.emit('output', new_msg);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});