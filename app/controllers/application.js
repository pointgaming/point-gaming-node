var passport = require('passport')
  , BearerStrategy = require('passport-http-bearer').Strategy;

passport.use(new BearerStrategy(function(token, done) {
    geddy.model.Accesstoken.first({id: token}, function(err, accessToken) {
        if (err) { return done(err); }
        if (!accessToken) { return done(null, false); }
        accessToken.getUser(function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
        });
    });
}));

var Application = function () {
    var helpers = require("../helpers/application").helpers,
        _ = require("underscore")._,
        that = this;

    //that.protectFromForgery();
    that.requireAuth = function () {
        if (!this.currentUser) {
            this.redirect("/login");
        }
    };

    var currentUserId = null;
    that.currentUser = null;
    that.currentPath = null;

// set currentUserId (from session or passport-http-bearer)

    that.before(function(next) {
        currentUserId = this.session.get("userId");
        if (currentUserId) {
            next();
        } else {
            passport.authenticate('bearer', function(badCredsError, user, noCredsError) {
                if (user) {
                    currentUserId = user.id;
                }
                next();
            })(this.request, this.response);
        }
    }, {async: true});

// Set currentUser for views

    that.before(function (next) {
        var User = geddy.model.User;

        if (currentUserId) {
            User.first({ id: currentUserId }, function (err, _user) {
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
