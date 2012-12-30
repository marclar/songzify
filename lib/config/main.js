var auth = require('../auth');

module.exports = {
	
	app: function(__dirname){

		console.log('Inside config/main.js configureApp() (8645231)');

		io.listen(app);

		app.set('view engine', 'hbs'); 
		app.set('views', __dirname + '/views');

		//Add session support
		var store = new express.session.MemoryStore;
		app.use(express.cookieParser());
		app.use(express.session({
			secret: 'x1005%Dr#6QM937@F',
			store: store
		}));

		//Include session on every request
		app.all('*', auth.includeSession);

		//Require login for /admin and /api
		app.all('/admin*', auth.requireLogin);
		app.all('/api*', auth.requireLogin);

		//Bounce logged-in users to /admin if they hit the login page
		app.all('/login*', function(req, res, next){
			if(auth.isLoggedIn(req)){
				res.redirect('/admin');
			}
			else{
				next();
			}
		});

		//Static files...
		app.use('/public', express.static(__dirname + '/public', {maxAge:86400000})); 

		//Add shared partials
		hbs.registerPartial('head', fs.readFileSync(__dirname + '/views/partials/head.hbs', 'utf8'));
		hbs.registerPartial('header', fs.readFileSync(__dirname + '/views/partials/header.hbs', 'utf8'));
		hbs.registerPartial('footer', fs.readFileSync(__dirname + '/views/partials/footer.hbs', 'utf8'));
		hbs.registerPartial('auth', fs.readFileSync(__dirname + '/views/partials/auth.hbs', 'utf8'));

	}

};