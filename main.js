var fs = require('fs');
var server = require('./Server');
var globals = require('./globals.js');

//read configuration file
var data = fs.readFileSync('config.json');
config = JSON.parse(data);

//read configuration for css file
CONFIG_css_index_of = fs.readFileSync(config.system_pages.css_index_of);

console.log(config);

var s = new server.Server(config.http_listen_port);
s.start();
