var path = require('path');

module.exports = function(app) {
	app.get('/main', function(req, res) {
		res.render('main', {title: 'twenty-six'});
	});
	app.get('/today', function(req, res) {
		res.render('today/today', {title: 'twenty-six today'});
	});
};