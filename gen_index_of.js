var mmm = require('mmmagic');
var fs = require('fs');
var get_file = require('./get_file.js')
var globals = require('./globals.js');

//Generates the page we see for a directory (list of files,...) if there is no default index file in
function genIndexOf(path, callback) {
	//Add / at the end or not, to avoids bugs like "dir1dir2" instead of "dir1/dir2"
	var current_dir = path.replace(RegExp(config.web_directory), '');
	if (current_dir[current_dir.length-1] != '/') current_dir += '/';
	if (path[path.length-1] != '/') path += '/';

	//Check if default file exists
	fs.exists(path+config.default_index_name, function(exists_bool){
		//If yes, just show it
		if (exists_bool) {
			get_file.getFile(path+config.default_index_name, callback);
		}
		//If no, just show directory (if it's enabled)
		else if (config.show_directory) {
			fs.readdir(path, function(err, files) {
				if (err) console.log(err); //If an error occures (even if it should not)

				var generated = "<html><head><title>"+ current_dir +"</title>"; // Title
				generated += "<style>"+ CONFIG_css_index_of +"</style>"; // CSS, can be changed :)
				generated += "</head><body>";

				directories_list = current_dir.split('/'); //return ['', 'path', 'to', 'folder' ,'']
				directories_list[0] = '/'; // Add root folder

				// Header navigation bar
				var link = "";
				generated += "<ul id='nav-bar'>";
				for (var i=0; i<directories_list.length-1; i++) {
					//Generate link
					if (i!=0) link += '/' + directories_list[i];
					else link = '/';

					generated += "<li class='path_to_folder'>";
					generated += "<a href='"+link+"'>";
					generated += "<img src='"+ config.img.crumb +"' alt='>'></img>";
					generated += "<span>"+ directories_list[i] +"</span>";
					generated += "</a></li>";

					//Avoid bugs
					if (link == '/') link = '';
				}
				generated += "</ul>";

				//Rest of the page
				generated +="<div id='content'>";

				generated += "<h1>Index of " + current_dir + "</h1>";

				detectMIMETypes(path, files, [], 0, function(mimes_types) {

					generated += "<ul id='entry_list'>";
					//Root dir before
					generated += "<li class='entry'><a href='/'>/</a></li>";

					for (var i=0; i<files.length; i++) {
						generated += "<li class='entry'>";
						if (mimes_types[i] == config.directory_mime_type) {
							generated += "<a href='" + current_dir + files[i] + "'>" + files[i] + "/</a>";
						}
						else {
							generated += "<a href='" + current_dir + files[i] + "'>" + files[i] + "</a>";
						}
						generated += "</li>";
					}

					generated += "</ul>";
					generated += "</div>"; //id: content
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
	console.log("MIME Detection : "+path+files[i]);
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

module.exports.genIndexOf = genIndexOf;