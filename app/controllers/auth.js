var passport = require('../helpers/passport'),

    Auth = function () {
        this.respondsWith = ["html", "json"];

        geddy.mixin(this, passport.actions);
    };

exports.Auth = Auth;
