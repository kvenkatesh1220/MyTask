# MyTask
Task For generating the Token and Refreshing the Token for every request

You Can Start the server by cloning this repository and by executing "npm install".

i provided two URLs.

1) For getting the token.
URL : http://localhost:8081/api/v1/getToken
Request : POST
Body : { "email" : "konduruvenkatesh04@gmail.com" }
Description: It will generate the token with email Id and new date + 5 min.
And i am storing this into "Redis".
we Can specify the token expire in using "expire" function in redis.

2) For ever request refreshing the token for next 5 min.
URL : http://localhost:8081/api/v1/acceptRequest
Request : GET
Headers : 
 Authorization : Bearer "Token Get from the First URL".
 
 Description : this function will take the "Authorization" from the header. it will decode and get the token from redis by using email as 
 Key. and it will comepare the two tokens. 
 
 if two tokens are same the it will generate the new token with expire time and replaces the old token and same token sent to the client
 for the next request.
 if two are not equal it will display the message 
 "{
    "error": "Token Mismatch. Please get Token URL to get new Token by passing Email. "
}".
