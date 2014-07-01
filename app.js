var http = require('http')
  , fs = require('fs')
  , express = require('express');

var app = express();
var server = http.createServer(app).listen(5000);

var env = process.env.NODE_ENV || 'development';
if('development' == env) {
	app.use(express.static(__dirname + '/public/'));
	app.set('view engine', 'jade');
	app.set('view option', {layout: false});
	app.set('views', __dirname + '/app/views');
}


require('./app/route.js')(app);