var rest = require('restler');

var client = function(api_endpoint){
  this.api_endpoint = api_endpoint;
};

client.prototype.auth_key = 'auth_token';

client.prototype.buildApiUrl = function(url, auth_token){
  return this.api_endpoint + url + '?' + this.auth_key + "=" + auth_token;
};

client.prototype.getFriends = function(auth_token, callback){
  var url = '/api/v1/friends';

  rest.get(this.buildApiUrl(url, auth_token)).on('complete', function(result) {
    if (result && result.success === true) callback(null, result);
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
