var fs = require('fs');
var server = require('./Server');
var globals = require('./globals.js');

//read configuration file
console.log("Reading configuration...");
var data = fs.readFileSync('config.json');
config = JSON.parse(data);
console.log("\tDone.");

//read configuration for css file
console.log("Reading system files....")
CONFIG_css_index_of = fs.readFileSync(config.system_pages.css_index_of);
console.log("\tDone.");

var s = new server.Server(config.http_listen_port);
s.start();
