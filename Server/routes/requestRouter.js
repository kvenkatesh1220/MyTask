"use strict";

module.exports = function registerRoutes(app){
	var api_v1_routes = require('./api/v1')(app);
};
