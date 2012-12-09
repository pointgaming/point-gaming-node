var passport = require("../helpers/passport"),
    cryptPass = passport.cryptPass,
    requireAuth = passport.requireAuth;

var Games = function () {
    this.respondsWith = ["html", "json"];

    this.before(requireAuth);

    this.index = function (req, resp, params) {
        this.respond({params: params});
    };
};

exports.Games = Games;
