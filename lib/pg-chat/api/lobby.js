"use strict";

var util = require("util"),
    rest = require("restler"),
    baseClient = require("./client"),
    client = Object.create(baseClient),
    PointGaming = global.PointGaming;

client.api_endpoint = PointGaming.config.api_url;
client.api_token = PointGaming.config.api_token;

client.join = function (game_id, user_id) {
    var url = this.buildApiUrl("/api/games/" + game_id + "/lobbies/join", this.api_token),
        data = {
            user_id: user_id
        };

    return rest.put(url, {
        data: data
    });
};

client.leave = function (game_id, user_id) {
    var url = this.buildApiUrl("/api/games/" + game_id + "/lobbies/leave", this.api_token),
        data = {
            user_id: user_id
        };

    return rest.put(url, {
        data: data
    });
};

module.exports = client;
