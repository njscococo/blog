var setting = require('../settings'),
	DB = require('mongodb').Db,
	Connetion = require('mongodb').Connetion,
	Server = requre('mongodb').Server;

module.exports = new Db(settings.db, new Server(settings.host, settings.port), {safe: true});
