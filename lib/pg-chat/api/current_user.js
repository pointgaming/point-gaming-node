var util = require('util'),
    rest = require('restler'),
    base_client = require('./client');

var client = function(api_endpoint){
  client.super_.call(this, api_endpoint);

  this.auth_key = 'auth_token';
};
util.inherits(client, base_client);

client.prototype.getFriends = function(auth_token, callback){
  var url = '/api/friends';

  rest.get(this.buildApiUrl(url, auth_token)).on('complete', function(result) {
    if (result) callback(null, result);
    else callback(result);
  });
};

client.prototype.getUserSession = function(auth_token, callback){
  var url = '/api/v1/sessions/show';

  rest.get(this.buildApiUrl(url, auth_token)).on('complete', function(result) {
    if (result && result.success === true) callback(null, result);
    else callback(result);
  });
};

client.prototype.setUserSession = function(auth_token, data, callback){
  var url = '/api/v1/sessions/id';

  rest.json(this.buildApiUrl(url, auth_token), data, {}, 'PUT').on('complete', function(result) {
    if (result && result.success === true) callback(null, result);
    else callback(result);
  });
};

module.exports = client;
