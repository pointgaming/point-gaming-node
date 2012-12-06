var passport = require('../helpers/passport'),

    Auth = function () {
        geddy.mixin(this, passport.actions);
    };

exports.Auth = Auth;
