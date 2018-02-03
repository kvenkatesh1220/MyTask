var moment  = require("moment");
var jwt = require('jwt-simple');
var _	= require('lodash');
var tokenStoreClient 	= require(appRootPath + "/Server/plugins/TokenStore/TokenStoreClient");

	module.exports = (function(){
		return (function(){
			var secret = 'myTest';

			function storeTokenInRedis(token, cb){
				var decodeToken = jwt.decode(token, secret);
				var email = decodeToken.email;
				tokenStoreClient.set(email, token, function(err, result){
					console.log(result);
					if(err){
						return cb(err, null);
					}
					return cb(null, result);
				});
			}

			function getToken(req, res){
				var requestBody = req.body;
				var email = requestBody.email;
				console.log(email);
				var tokenData = {
					email : email
				};
				var tokenExpireTime = new Date().getTime() + 300000;
				tokenData.expireTime = tokenExpireTime;
				var encodingTOken = jwt.encode(tokenData, secret, 'HS512');
				// If you want Redis UnComment It.
				storeTokenInRedis(encodingTOken, function(err, result){
					if(err){
						return res.status(400).send(err);
					}
					return res.status(200).send({token : encodingTOken});
				});
				// return res.status(200).send({token : encodingTOken});
			}

			function acceptRequest(req, res){
				console.log(req);
				var token = _.get(req, "headers.authorization", "");
				if(_.isEmpty(token)){
					return res.status(400).send({error : "Token Required."})
				}
				var tokenWithOutBearer = token.split(" ")[1];
				var decodeToken = jwt.decode(tokenWithOutBearer, secret);
				tokenStoreClient.get(decodeToken.email, function(err, tokenFromRedis){
					var isequal = _.isEqual(tokenWithOutBearer, tokenFromRedis);
					var decodeOldToken = jwt.decode(tokenFromRedis, secret);
					var expireTimeInMillSec = decodeOldToken.expireTime;
					var nowInMillisec = new Date().getTime();
					if(expireTimeInMillSec < nowInMillisec){
						return res.status(400).send({reason : "Token expired."});
					}
					if(isequal){
						var tokenData = {
							email : decodeToken.email
						};
						var tokenExpireTime = new Date().getTime() + 300000;
						tokenData.expireTime = tokenExpireTime;
						var encodingTOken = jwt.encode(tokenData, secret, 'HS512');
						storeTokenInRedis(encodingTOken, function(err, result){
							if(err){
								return res.status(400).send(err);
							}
							return res.status(200).send({token : encodingTOken});
						});
					}
					else{
						return res.status(400).send({error : "Token Mismatch. Please get Token URL to get new Token by passing Email. "});
					}
				});
			}

			return {
				"getToken"		: getToken,		
				"acceptRequest" : acceptRequest
			};
		}());
	}());
