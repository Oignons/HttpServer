var fs = require('fs');
var mmm = require('mmmagic');
var globals = require('./globals.js');

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
		genDirPage(path, callback)
		return;
	}
	else {
		callback(err.code);
		return;
	}
}

//Generates the page we see for a directory (list of files,...) if there is no default index file in
function genDirPage(path, callback) {
	//Add / at the end or not, to avoids bugs like "dir1dir2" instead of "dir1/dir2"
	var current_dir = path.replace(RegExp(config.web_directory), '');
	if (current_dir[current_dir.length-1] != '/') current_dir += '/';
	if (path[path.length-1] != '/') path += '/';

	//Check if default file exists
	fs.exists(path+config.default_index_name, function(exists_bool){
		//If yes, just show it
		if (exists_bool) {
			getFile(path+config.default_index_name, callback);
		}
		//If no, just show directory (if it's enabled)
		else if (config.show_directory) {
			fs.readdir(path, function(err, files) {
				if (err) console.log(err);

				var generated = "<html><head><title>Directory</title></head><body>";

				generated += "<h1>Index of " + path + "</h1>";

				//Root dir before
				generated += "<a href='/'>/</a><br/>";

				detectMIMETypes(path, files, [], 0, function(mimes_types) {
					for (var i=0; i<files.length; i++) {
						if (mimes_types[i] == config.directory_mime_type) {
							generated += "<a href='" + current_dir + files[i] + "'>" + files[i] + "/</a><br/>";
						}
						else {
							generated += "<a href='" + current_dir + files[i] + "'>" + files[i] + "</a><br/>";
						}
					}
					generated += "</body></html>";
					callback(generated);
				});
			});
		}
		else {
			getFile(config.system_pages.http403, function(content) {
				callback(content);
			});
		}
	});
}

//Detect the MIME types in order to add a '/' at the end of the name of a directory
function detectMIMETypes(path, files, mimes_types, i, callback) {
	console.log(path+files[i]);
	if (i < files.length) {
		var magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
		magic.detectFile(path+files[i], function(err, result) {
			if (err) mimes_types[i] = 'unknown';
			else {
				mimes_types[i] = result;
				detectMIMETypes(path, files, mimes_types, i+1, callback);
			}
		});
	}
	else {
		callback(mimes_types);
	}
}


module.exports.getFile = getFile;