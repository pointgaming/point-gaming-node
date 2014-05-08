"use strict";

var util = require("util"),
    rest = require("restler"),
    baseClient = require("./client"),
    PointGaming = global.PointGaming,
    client = Object.create(baseClient);

client.api_endpoint = PointGaming.config.api_url;
client.api_token = PointGaming.config.api_token;

client.getUser = function (id) {
    var url = this.buildApiUrl("/api/users/" + id, this.api_token);
    return rest.get(url);
};

client.getUsers = function (user_ids) {
    var url = this.buildApiUrl("/api/users", this.api_token);
    return rest.json(url, {
        user_id: user_ids
    });
};

module.exports = client;
