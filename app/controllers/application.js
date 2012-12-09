var Application = function () {
    var helpers = require("../helpers/application").helpers,
        _ = require("underscore")._,
        that = this;

    that.protectFromForgery();

// Set currentUser for views

    that.before(function (next) {
        var userId = this.session.get("userId"),
            User = geddy.model.User;

        that.currentUser = null;

        if (userId) {
            User.first({ id: userId }, function (err, _user) {
                that.currentUser = _user;
                next();
            });
        } else {
            next();
        }
    }, { async: true });

// Include helper functions

    _.each(helpers, function (helper, key) {
        that[key] = helpers[key];
    });
};

exports.Application = Application;
