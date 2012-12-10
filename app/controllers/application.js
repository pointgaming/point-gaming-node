var Application = function () {
    var helpers = require("../helpers/application").helpers,
        _ = require("underscore")._,
        that = this;

    that.protectFromForgery();
    that.requireAuth = function () {
        if (!this.session.get("userId")) {
            this.redirect("/login");
        }
    };

    that.currentUser = null;
    that.currentPath = null;

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

    that.before(function (next) {
        that.currentPath = this.request.req.url;
        next();
    }, { async: true });
};

exports.Application = Application;
