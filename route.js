var url = require('url');
var globals = require('./globals');
var contenttypesetter = require('./set_content_type');
var files = require('./get_file');

route = function (pathname, response) {
	// Add web directory to pathname
	pathname = config.web_directory + pathname;

	contenttypesetter.setContentType(pathname, function(mimetype) {
		response.writeHead(200, {"Content-Type": mimetype});

		files.getFile(pathname, function(content) {
			response.write(content);
			response.end();
		});
	});
	
}

module.exports.route = route;
