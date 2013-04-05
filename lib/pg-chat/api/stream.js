var util = require('util'),
    rest = require('restler'),
    base_client = require('./client');

var client = function(api_endpoint, api_token){
  client.super_.call(this, api_endpoint);

  this.api_token = api_token;
};
util.inherits(client, base_client);

client.prototype.getStream = function(id, callback){
  var url = '/api/v1/streams/' + id;

  rest.get(this.buildApiUrl(url, this.api_token)).on('complete', function(result) {
    if (result) callback(null, result);
    else callback(result);
  });
};

client.prototype.incrementViewerCount = function(id, count, callback){
  var url = '/api/v1/streams/' + id + '/incrementViewerCount',
      data = {
        count: count
      };

  rest.json(this.buildApiUrl(url, this.api_token), data, {}, 'PUT').on('complete', function(result) {
    if (result) callback(null, result);
    else callback(result);
  });
};

module.exports = client;
