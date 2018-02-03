"use strict";

var http	= require('http');
var https	= require('https');
var fse		= require("fs-extra");

var Config	= require(appRootPath + "/Server/config/config.js");

var WebServer = (function () {
	var localWebServerConfig = {
		"runOnlyInSecureMode" : Config.get("WebServer.runOnlyInSecureMode"),
		"port" : {
			"secure" : Number(Config.get("WebServer.port.secure")),
			"nonSecure" : Number(Config.get("WebServer.port.nonSecure")),
		},
		"certs" : {
			"privateKey" : Config.get("WebServer.certs.privateKey"),
			"certificate" : Config.get("WebServer.certs.certificate"),
		}
	};
	return {
		//I appended 'Instance' to the function name so that it doesn't confuse with http.createServer
		"createServerInstance" : function createServerInstance(app){
			if(localWebServerConfig.runOnlyInSecureMode === true){
				var privateKeyBuffer = fse.readFileSync(localWebServerConfig.certs.privateKey, 'utf8');
				var certificateBuffer = fse.readFileSync(localWebServerConfig.certs.certificate, 'utf8');

				var credentials = {key: privateKeyBuffer, cert: certificateBuffer};
				var SecureWebServer = https.createServer(credentials, app);
				return SecureWebServer;
			}
			else{
				var NonSecureWebServer = http.createServer(app);
				return NonSecureWebServer;
			}
		},

		"start" : function start(serverInstance){
			if(localWebServerConfig.runOnlyInSecureMode === true){
				serverInstance.listen(localWebServerConfig.port.secure, function listen(){
					var host = serverInstance.address().address;
					var port = serverInstance.address().port;
					console.log("SECURE WEB SERVER started, listening at https://%s:%s\n", host ==="::" ? "127.0.0.1" : host, port);
				});
			}
			else{
				serverInstance.listen(localWebServerConfig.port.nonSecure, function listen(){
					var host = serverInstance.address().address;
					var port = serverInstance.address().port;
					console.log("HTTP web server started, listening at http://%s:%s\n", host ==="::" ? "127.0.0.1" : host, port);
				});
			}
		}
	};
}());

module.exports = WebServer;
