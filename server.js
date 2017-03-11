var express = require('express');
var fs = require('fs');
var app = express();
//var ip   = process.env.IP || '127.0.0.1';
var port = process.env.PORT || 3000;

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname+'/public'));
var socket = require('socket.io');

io.sockets.on('connection', newConnection);

var allIds = [];
function newConnection(socket){  	

  	//console.log('new connection: ' + socket.id);
  	socket.emit('myId', socket.id);  	
  	allIds.push(socket.id);  	
	  io.emit('connectIds', allIds);// first

      /*
	socket.on('updateUser', function(data){ 
    var dataArray = [];
    dataArray.push(data);
    for(var i = 0; i< dataArray.length; i++){ 
      //socket.broadcast.emit('updateAllUser', dataArray[i]);
      io.sockets.emit('updateAllUser', dataArray[i]);
    }    		
	}); */
  socket.on('updateUser', function(data){
    var myReadStream = fs.createReadStream(data);
    io.sockets.emit('updateAllUser', myReadStream);
  });
   
	socket.on('disconnect', function(){
	  var deleting = allIds.indexOf(socket.id);        
      allIds.splice(deleting,1);      
      //console.log(socket.id +' deleted');      
      io.emit('remove-user', {detail: socket.id});             
    });	
};
http.listen(port); //(port,ip)