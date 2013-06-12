var util = require('util'),
    rest = require('restler'),
    base_client = require('./client');

var client = function(api_endpoint, api_token){
  client.super_.call(this, api_endpoint);

  this.api_token = api_token;
};
util.inherits(client, base_client);

client.prototype.getGameRoom = function(id, callback){
  var url = '/api/v1/game_rooms/' + id;

  rest.get(this.buildApiUrl(url, this.api_token)).on('complete', function(result) {
    if (result) callback(null, result);
    else callback(result);
  });
};

client.prototype.destroyGameRoom = function(id, callback){
  var url = '/api/v1/game_rooms/' + id;

  rest.json(this.buildApiUrl(url, this.api_token), {}, {}, 'DELETE').on('complete', function(result) {
    if (result) callback(null, result);
    else callback(result);
  });
};

client.prototype.joinGameRoom = function(game_room_id, user_id){
  var url = this.buildApiUrl('/api/v1/game_rooms/' + game_room_id + '/join', this.api_token),
      data = {user_id: user_id};

  return rest.put(url, {data: data});
};

client.prototype.leaveGameRoom = function(game_room_id, user_id){
  var url = this.buildApiUrl('/api/v1/game_rooms/' + game_room_id + '/leave', this.api_token),
      data = {user_id: user_id};

  return rest.put(url, {data: data});
};

module.exports = client;
