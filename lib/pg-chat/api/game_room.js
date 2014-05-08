"use strict";

var util = require("util"),
    rest = require("restler"),
    baseClient = require("./client"),
    client = Object.create(baseClient),
    PointGaming = global.PointGaming;

client.api_endpoint = PointGaming.config.api_url;
client.api_token = PointGaming.config.api_token;

client.getGameRoom = function (id) {
    var url = this.buildApiUrl("/api/game_rooms/" + id, this.api_token);
    return rest.get(url);
};

client.joinGameRoom = function (game_room_id, user_id) {
    var url = this.buildApiUrl("/api/game_rooms/" + game_room_id + "/join", this.api_token),
        data = {
            user_id: user_id
        };

    return rest.put(url, {
        data: data
    });
};

client.leaveGameRoom = function (game_room_id, user_id) {
    var url = this.buildApiUrl("/api/game_rooms/" + game_room_id + "/leave", this.api_token),
        data = {
            user_id: user_id
        };

    return rest.put(url, {
        data: data
    });
};

module.exports = client;
