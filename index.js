var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

users = {}

var server = require('http').Server(app);
io = require('socket.io')(server);

io.sockets.on("connection", function(socket){
    console.log("User Connected")
    socket.on("new", function(data, callback){
        console.log(data.name)
        if(data in users){
            callback(false)
        }
        else{
            callback(true)
            socket.name = data.name
            users[socket.name] = socket
        }
    })

    socket.on("message", function(data, callback){
        callback(data.message)
        try {
            io.to(users[data.toUser].emit("private_message", data.message))
            console.log(data)

        } catch (error) {
            console.log(error)
        }
    })
})


server.listen(5500);