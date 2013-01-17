var strategies = require("../helpers/passport/strategies"),
    authTypes = geddy.mixin(strategies, {
        local: {
            name: "local account"
        }
    });

var Home = function () {
    this.index = function (req, resp, params) {
        var that = this;

        geddy.model.News.all(function (err, news) {
            params.news = news;

            that.respond(params, {
                format: "html",
                template: "app/views/home/index"
            });
        });
    };

    this.login = function (req, resp, params) {
        this.respond(params, {
            format: "html",
            template: "app/views/home/login"
        });
    };

    this.logout = function (req, resp, params) {
        var self = this;

        this.session.unset("userId");
        this.session.unset("authType");
        this.currentUser = null;

        this.session.close(function(){
            self.session.reset();
            self.respond(params, {
                format: "html",
                template: "app/views/home/logout"
            });
        });
    };
};

exports.Home = Home;
