"use strict";

var JSONPath	= require("JSONPath");

var Config = (function initConfig(){
		var configToUse = {
			"Database": {
				"MongoDb": {
					"url": "mongodb://127.0.0.1:27017/test4"
				}
			},
			"Cache": {
				"Redis": {
					"host": "127.0.0.1",
					"port": 6379,
					"db": 1
				}
			},
			"WebServer": {
				"runOnlyInSecureMode": false,
				"domainName": "localhost",
				"publicAccessibleUrl": "http://localhost:8081",
				"port": {
					"secure": 443,
					"nonSecure": 8081
				}
			}
		};		

	var getProperty = function (name) {
		var propertyObj = JSONPath({json: configToUse, path: "$."+name})[0];
		return propertyObj;
	}

	return { "get" : getProperty }
}());

module.exports = Config;
