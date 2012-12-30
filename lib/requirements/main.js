module.exports = {

	//This object will be iterated over to include required modules
	modules: {
		assert: null,
		http: null,
		sys: null,
		fs: null,
		
		express: null,
		expose: 'express-expose',
		hbs: null,
		$: 'jquery',
		_: 'underscore',
		
		oauth: null,
		nodeio: 'node.io',
		io: 'socket.io',
		
		amqp: null,
		pg: null,

		auth: './lib/auth',
		config: './lib/config',
		routes: './lib/routes'
	}

};
