var strategies = require("../helpers/passport/strategies"),
    authTypes = geddy.mixin(strategies, {
        local: {
            name: "local account"
        }
    });

var Home = function () {
    this.index = function (req, resp, params) {
        this.respond(params, {
            format: "html",
            template: "app/views/home/index"
        });
    };

    this.login = function (req, resp, params) {
        this.respond(params, {
            format: "html",
            template: "app/views/home/login"
        });
    };

    this.logout = function (req, resp, params) {
        this.session.unset("userId");
        this.session.unset("authType");
        this.respond(params, {
            format: "html",
            template: "app/views/home/logout"
        });
    };
};

exports.Home = Home;
