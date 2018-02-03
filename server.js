/*jshint node: true */
/*jslint node: true */
'use strict';

var express					= require('express');
var path					= require('path');
var bodyParser				= require('body-parser');

global.appRootPath = path.resolve(__dirname);
global.appStartTime = new Date();

var config = require(global.appRootPath + "/Server/config/config.js");

var g_database = require('./Server/plugins/DataBase');
g_database.initialize();


/*
Create a redis client instance and initialize it. If redis client is already
initialized, then a reference to client is just returned
*/
var redisClient = require('./Server/plugins/RedisClient');

/*
Create express.js application and configure the routes that need to be served
by the web server.
*/
var app = express();

//app.use(g_module_cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json({
		limit: '1mb', type:'application/json'
	})
);

/*
specify limit so that the app doesn't blindly reject the file/image
upload with "request entity too large: 413"
*/
app.use(bodyParser.urlencoded({
		limit: '2mb',
		extended: true
		/* , type:'application/x-www-form-urlencoding' */
	})
);


require("./Server/routes/requestRouter")(app);

/*
Start the web server.
The server mode (Http / Https) is retrieved from Config
*/
var WebServer = require("./Server/plugins/webServer/webServer");
var server = WebServer.createServerInstance(app);

WebServer.start(server);

