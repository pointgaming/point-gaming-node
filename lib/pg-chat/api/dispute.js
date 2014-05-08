"use strict";

var util = require("util"),
    rest = require("restler"),
    baseClient = require("./client"),

    client = function (api_endpoint, api_token) {
        client.super_.call(this, api_endpoint);

        this.api_token = api_token;
    };

util.inherits(client, baseClient);

client.prototype.getDispute = function (id, callback) {
    var url = "/api/disputes/" + id;

    rest.get(this.buildApiUrl(url, this.api_token)).on("complete", function (result) {
        if (result) {
            callback(null, result);
        } else {
            callback(result);
        }
    });
};

client.prototype.incrementAdminViewerCount = function (id, count, callback) {
    var url = "/api/disputes/" + id + "/incrementAdminViewerCount",
        data = {
            count: count
        };

    rest.json(this.buildApiUrl(url, this.api_token), data, {}, "PUT").on("complete", function (result) {
        if (result) {
            callback(null, result);
        } else {
            callback(result);
        }
    });
};

client.prototype.incrementUserViewerCount = function (id, count, callback) {
    var url = "/api/disputes/" + id + "/incrementUserViewerCount",
        data = {
            count: count
        };

    rest.json(this.buildApiUrl(url, this.api_token), data, {}, "PUT").on("complete", function (result) {
        if (result) {
            callback(null, result);
        } else {
            callback(result);
        }
    });
};

module.exports = client;
