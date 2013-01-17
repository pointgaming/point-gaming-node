var strategies = require("../helpers/passport/strategies"),
    authTypes = geddy.mixin(strategies, {
        local: {
            name: "local account"
        }
    });

var Home = function () {
    this.respondsWith = ["html", "json"];

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
        var callback = function(err){
            if (geddy.emitter && self.currentUser) {
                geddy.emitter.emit('user_logged_out', self.currentUser);
            }

            self.currentUser = null;

            if (params.format !== 'html') {
              params = {success: true};
            }

            self.respond({params: params}, {
              template: "app/views/home/logout"
            });
        };

        if (req.query && 'access_token' in req.query) {
            geddy.model.Accesstoken.remove(req.query['access_token'], callback);
        } else {
            this.session.unset("userId");
            this.session.unset("authType");
            this.session.close(function() {
                self.session.reset();
                callback();
            });
        }
    };
};

exports.Home = Home;
