var fs = require('fs');
var globals = require('./globals.js');
var indexof = require('./gen_index_of.js')

//Get a file
function getFile(file, callback) {
	fs.readFile(file, function (err, content) {

		if (err) {
			errorHandle(err, file, callback)
			return;
		}

		// Nothing special : the file exists and it's readable
		callback(content);
	});
}

//Exceptions : directories, dead links, ...
function errorHandle(err, path, callback) {
	//Unknown file or directory
	if (err.code == 'ENOENT' || err.code == 'ENOTDIR') {
		getFile(config.system_pages.http404, function(content) {
			callback(content);
		});
		return;
	}
	//If it's a directory
	if (err.code = 'EISDIR') {
		indexof.genIndexOf(path, callback) //Generate index page and show it
		return;
	}
	else {
		callback(err.code);
		return;
	}
}


module.exports.getFile = getFile;