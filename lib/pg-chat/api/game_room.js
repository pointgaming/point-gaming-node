var util = require('util'),
    rest = require('restler'),
    base_client = require('./client');

var client = Object.create(base_client);

client.api_endpoint = PointGaming.config.api_url;
client.api_token = PointGaming.config.api_token;

client.getGameRoom = function(id){
  var url = this.buildApiUrl('/api/game_rooms/' + id, this.api_token);
  return rest.get(url);
};

client.joinGameRoom = function(game_room_id, user_id){
  var url = this.buildApiUrl('/api/game_rooms/' + game_room_id + '/join', this.api_token),
      data = {user_id: user_id};

  return rest.put(url, {data: data});
};

client.leaveGameRoom = function(game_room_id, user_id){
  var url = this.buildApiUrl('/api/game_rooms/' + game_room_id + '/leave', this.api_token),
      data = {user_id: user_id};

  return rest.put(url, {data: data});
};

module.exports = client;
