'use strict'
var redis		= require("redis");
var Config		= require(appRootPath + "/Server/config/config.js");

var Promise			= require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

var RedisClient = (function RedisClient() {

	var port = Config.get("Cache.Redis.port");
	var host = Config.get("Cache.Redis.host");
	var options = { "db" : 1 };
	console.log("Creating Cache with Redis. Host=" + host + ", Port=" + port + ", DB=" + options.db);
	var client = redis.createClient(port, host, options);

		client.on('connect', function onConnect() {
			console.log('Redis Client is connected');
		});

		client.on('ready', function onReady() {
			console.log('Redis Client is connected and is ready.');
		});

		client.on('reconnecting', function onReconnecting(reConnectionDetails) {
			console.log('Redis Client is reconnecting.' + JSON.stringify(reConnectionDetails, 0,2));
		});

		client.on("end", function onEnd(err) {
			console.log('Redis Client connection is now ended.');
		});

		client.on("error", function onError(msg) {
			console.error("Redis Client Error : " + msg);
		});

		client.on("warning", function onWarning(msg) {
			console.warn("Redis Client Warning : " + msg);
		});

		client.on('disconnect', function onDisconnect() {
			console.log("Client is disconnected");
		});

		client.on('monitor', function onMonitor(time, args) {
			console.log(time + ': ' + JSON.stringify(args, 0, 2));
		});

		// If the Node process ends, shutdown the client.
		process.on('SIGINT', function onSIGINT() {
			client.quit();
		});

	console.log("Returning a new redis client");
	return client;
}());

module.exports = RedisClient;
