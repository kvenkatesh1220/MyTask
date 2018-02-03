'use strict';

var mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

var Config	= require(appRootPath + "/Server/config/config.js");

var Database = (function () {
	var mongoDb = {
		"url" :  Config.get("Database.MongoDb.url")  //"mongodb://127.0.0.1:27017/test"
	};

	return {
		"initialize" : function initialize() {

			var mongooseConnection = mongoose.createConnection( mongoDb.url );

			var mongooseConnectionOptions = {
				// db: {
				// 	native_parser: true
				// },
				server: {
					poolSize: 10,
					socketOptions: {
						socketTimeoutMS: 0,		//Default value is 0 or null (implies infinite)
						connectTimeoutMS: 900000
					},
					numberOfRetries : 2,
					retryMiliSeconds : 5000,		//default 5000 ms
				},
				// user: 'myUserName',
				// pass: 'myPassword'
			}


			mongoose.set('debug', true);

			mongoose.connect(
				mongoDb.url,
				//mongooseConnectionOptions,
				function onConnect(err){
					if(err){
						throw err;
					}
				}
			);

			mongooseConnection.on('connected', function onConnected() {
				console.log("Mongoose connected");
			});

			mongooseConnection.on('error',function onError(err) {
				console.error("Mongoose default connection error: " + err);
			});

			mongooseConnection.on('disconnected', function onDisconnected() {
				console.error("Mongoose default connection disconnected");
			});

			mongooseConnection.once('open', function onFirstTimeOpen(msg) {
				console.log("Mongoose default connection open to " + mongoDb.url );
			});
			// If the Node process ends, close the Mongoose connection
			process.on('SIGINT', function onProcessSIGINT() {
				mongooseConnection.close(function close() {
					console.log("Mongoose default connection disconnected through app termination");
					process.exit(0);
				});
			});

			return mongooseConnection;
		}
	};
}());

module.exports = Database;
