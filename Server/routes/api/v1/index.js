'use strict';

module.exports = function(app){

{
	var tokenGenerateRefresh = require(appRootPath+"/Server/routes/api/v1/common/tokenGenerateRefresh");
	app.post("/api/v1/getToken",tokenGenerateRefresh.getToken);
	app.get("/api/v1/acceptRequest",tokenGenerateRefresh.acceptRequest);
}
}; //end