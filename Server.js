var http = require('http');
var url = require('url');

var handle = require('./route');

function onRequest(request, response) {
	// Get the name of the page requested
	var pathname = url.parse(request.url).pathname;
	// Log it
	console.log('Request for : '+ pathname);
	
	// Route the request
	handle.route(pathname, response);
}

Server = function(port) {
	this.port = port;
}

Server.prototype.start = function() {
	http.createServer(onRequest).listen(this.port);
};

module.exports.Server = Server;