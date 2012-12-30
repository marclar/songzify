var express = require('../../node_modules/express');

module.exports = {
	
	isLoggedIn: function(req){
		return (req.session && req.session.loggedIn && req.session.userId && req.session.userId.length);
	},

	includeSession: function(req, res, next){
		app.locals({session: req.session});
		next();
	},

	requireLogin: function(req, res, next){

		if(isLoggedIn(req)){
			req.session.msg = 'LOGGED IN!! (9322954)';
			next();
		}
		else{
			req.session.msg = 'not logged in.... :( (1691890)';
			res.redirect('/login');
		}

	}

};