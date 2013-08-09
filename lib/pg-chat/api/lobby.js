var util = require('util'),
    rest = require('restler'),
    base_client = require('./client');

var client = Object.create(base_client);

client.api_endpoint = PointGaming.config.api_url;
client.api_token = PointGaming.config.api_token;

client.join = function(game_id, user_id){
  var url = this.buildApiUrl('/api/lobbies/' + game_id + '/join', this.api_token),
      data = {user_id: user_id};

  return rest.put(url, {data: data});
};

client.leave = function(game_id, user_id){
  var url = this.buildApiUrl('/api/lobbies/' + game_id + '/leave', this.api_token),
      data = {user_id: user_id};

  return rest.put(url, {data: data});
};

module.exports = client;
