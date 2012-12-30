log = console.log;

// Requirements
(function(required){
	for(name in required.modules){
		var module = required.modules[name] ? required.modules[name] : name;
		this[name] = require(module);
	}
})(require('./lib/requirements'));

//Create app
app = express.createServer(express.logger());

//Configure app
config.app.call(global, __dirname);

//Configure routes
routes.init.call(global);

//Listen for connections
var port = process.env.PORT || 5000;
app.listen(port, function() {
  log("Listening on " + port);
});