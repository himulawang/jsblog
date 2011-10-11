require('./config');
var express = require('express');
var app = express.createServer();
var BlogPost = require('./db').BlogPost;

app.use(app.router);
app.use(express.static(__dirname + '/'));

var downloads = {};
app.get('/*', function(req, res, next){
    var file = req.params[0];
    downloads[file] = downloads[file] || 0;
    ++downloads[file];
    next();
});

app.listen(PORT);

/* Websocket For Admin */
var WebSocketServer = require('websocket').server;

var ws = new WebSocketServer({ httpServer: app });

var connections = [];

ws.on('request', function(request){
    var connection = request.accept('jsblog', request.origin);
    connection.login = false;
    connections.push(connection);

    connection.on('close', function() {
        console.log('Disconnected');

        var index = connections.indexOf(connection);
        if (index !== -1) {
            delete connections[index];
        }
    });

    connection.on('message', function(message) {
        if (message.type !== 'utf8') {
            return;
        }
        // validate JSON
        try {
            var cmd = JSON.parse(message.utf8Data);
        } catch (e) {
            console.log(e);
            return;
        }
        // validate login
        if (!connection.login) {
            login(cmd.password, connection);
        }

        input(cmd, connection);
    });

});

var login = function(password, connection) {
    if (!password || password !== '123') {
        connection.close();
    }
    connection.login = true;
    var result = { result: 1 };
    output(result, connection);
};

var input = function(cmd, connection) {
    var action = cmd.action;
    if (!action || typeof process[action] === "undefined") {
        return;
    }
    process[action](cmd, connection);
};

var output = function(message, connection) {
    connection.sendUTF(JSON.stringify(message));
};

var Process = function() {};
Process.prototype.initList = function(cmd, connection) {
    BlogPost.find({})
        .desc('date')
        .run(function(err, docs) {
            output(docs, connection);
            console.log(docs);
        });
};
Process.prototype.add = function(cmd, connection) {
};

var process = new Process(); 
