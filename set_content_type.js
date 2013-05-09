var mmm = require('mmmagic');

function setContentType(pathname, callback) {

	var magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
	magic.detectFile(pathname, function(err, result){
		if (err) {
			console.log(err);
			callback('text/html');
			return;
		}
		//If it's a directory, change MIME otherwise the client will download a page
		if (result == config.directory_mime_type) {
			callback('text/html');
			return;
		}
		callback(result);
	});

}

module.exports.setContentType = setContentType;