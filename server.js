var express = require('express');
var app = express();
//var ip   = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.PORT || 3000;

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname+'/public'));
var socket = require('socket.io');

io.sockets.on('connection', newConnection);

	
var users = [];
var userIds = [];

function newConnection(socket){
  	console.log('new connection: ' + socket.id);

	socket.emit('myId', users.length);
	userIds[users.length] = socket.id;

	users.push(users.length);	
	io.emit('friends', users);
	socket.on('updateUser', function(data){
		socket.broadcast.emit('updateUser', data);
	});

	socket.on('disconnect', function(){
	  var deleting = userIds.indexOf(socket.id);        
          userIds.splice(deleting,1);
          users.splice(deleting,1);
          io.emit('remove-user', {detail: deleting});        
        });	
};
http.listen(port);