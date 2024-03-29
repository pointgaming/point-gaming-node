"use strict";

var PointGaming = global.PointGaming,
    authenticator = function () {};

authenticator.prototype.auth_key = "auth_token";

authenticator.prototype.authenticate = function (params, callback) {
    PointGaming.current_user_api_client.getUserSession(params[this.auth_key], function (err, result) {
        if (result && result.success === true) {
            callback(null, result.user);
        } else {
            callback(err || result);
        }
    });
};

module.exports = authenticator;
