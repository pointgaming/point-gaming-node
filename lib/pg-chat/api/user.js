var util = require('util'),
    rest = require('restler'),
    base_client = require('./client');

var client = function(api_endpoint, api_token){
  client.super_.call(this, api_endpoint);

  this.api_token = api_token;
};
util.inherits(client, base_client);

client.prototype.getUser = function(id, callback){
  var url = '/api/v1/users/' + id;

  rest.get(this.buildApiUrl(url, this.api_token)).on('complete', function(result) {
    if (result) callback(null, result);
    else callback(result);
  });
};

module.exports = client;
