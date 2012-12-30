var auth = require('../auth');

module.exports = {

	init: function(){

		//Render login page
		app.get('/login', function(req, res){

			res.render('login');

		});

		//Render admin page
		app.get('/admin', function(req, res){
			res.render('admin');
		});

		//Console
		app.get('/console', function(req, res){

			app.set('view options', {layout: false});

			res.render('console', {name: 'main (1448313)'});

			app.set('view options', {layout: true});

		});


	}

};
