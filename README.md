README
========

Little project in development. It's a http server serving static files of a web directory.
Everything is written in javascript with NodeJS (http://nodejs.org/).

USE
--------

Instal mmmagic (https://npmjs.org/package/mmmagic) : 
`$ npm install mmmagic`


Edit config.json : 

    http_listen_port : listening port for the server
    web_directory : path to the folder of your files
    default_index_name : name of the file opened if only the directory is specified
    show_directory : show or not the list of files in the directory (like Options-Indexes in Apache)
    http404 : path for http 404 error page
    http403 : path for forbidden page
    directory_mime_type : mime type for a directory, depends on where the server is running


Start the server with : `$ node main.js`