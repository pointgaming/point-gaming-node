var util = require('util'),
    rest = require('restler'),
    base_client = require('./client');

var client = Object.create(base_client);

client.api_endpoint = PointGaming.config.api_url;
client.api_token = PointGaming.config.api_token;

client.getUser = function(id){
  var url = this.buildApiUrl('/api/v1/users/' + id, this.api_token);
  return rest.get(url);
};

client.getUsers = function(user_ids){
  var url = this.buildApiUrl('/api/v1/users', this.api_token);
  return rest.json(url, {user_id: user_ids});
};

module.exports = client;
