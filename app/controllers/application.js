var Application = function () {
    var helpers = require("../helpers/application").helpers,
        _ = require("underscore")._,
        passport = require("../helpers/passport"),
        that = this;

    that.currentUser = null;
    that.currentPath = null;
    that.requireAuth = passport.requireAuth;
    that.protectFromForgery();

// Set currentUser for views

    that.before(function (next) {
        var userId = this.session.get("userId"),
            User = geddy.model.User;

        if (userId) {
            User.first({ id: userId }, function (err, _user) {
                that.currentUser = _user;
                next();
            });
        } else {
            next();
        }
    }, { async: true });

// Set currentPath for views

    that.before(function () {
        that.currentPath = this.request.req.url;
    });

// Include helper functions

    _.each(helpers, function (helper, key) {
        that[key] = helpers[key];
    });
};

exports.Application = Application;
