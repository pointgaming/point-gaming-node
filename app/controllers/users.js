var passport = require("../helpers/passport"),
    cryptPass = passport.cryptPass,
    requireAuth = passport.requireAuth;

var Users = function () {
    this.before(requireAuth, {
        except: ["add", "create"]
    });

    this.respondsWith = ["html", "json", "xml", "js", "txt"];

    this.index = function (req, resp, params) {
        var that = this;

        geddy.model.User.all(function (err, users) {
            that.respond({
                params: params,
                users: users
            });
        });
    };

    this.add = function (req, resp, params) {
        this.respond({
            params: params
        });
    };

    this.create = function (req, resp, params) {
        var that = this,
        user = geddy.model.User.create(params),
        sha;

        // Non-blocking uniqueness checks are hard
        geddy.model.User.first({
            username: user.username
        },
        function (err, data) {
            if (data) {
                params.errors = {
                    username: "This username is already in use."
                };
                that.transfer("add");
            }
            else {
                if (user.isValid()) {
                    user.password = cryptPass(user.password);
                }
                user.save(function (err, data) {
                    if (err) {
                        params.errors = err;
                        that.transfer("add");
                    }
                    else {
                        that.redirect({
                            controller: that.name
                        });
                    }
                });
            }
        });

    };

    this.show = function (req, resp, params) {
        var that = this, e;

        geddy.model.User.first(params.id, function (err, user) {
            if (!user) {
                e = new Error();
                e.statusCode = 400;
                that.error(e);
            } else {
                user.password = "";
                that.respond({
                    params: params,
                    user: user.toObj()
                });
            }
        });
    };

    this.edit = function (req, resp, params) {
        var that = this;

        geddy.model.User.first(params.id, function (err, user) {
            var e;

            if (!user) {
                e = new Error();
                e.statusCode = 400;
                that.error(e);
            } else {
                that.respond({
                    params: params,
                    user: user
                });
            }
        });
    };

    this.update = function (req, resp, params) {
        var that = this;

        geddy.model.User.first(params.id, function (err, user) {
            // Only update password if it"s changed
            var skip = params.password ? [] : ["password"];

            user.updateAttributes(params, {
                skip: skip
            });

            if (params.password && user.isValid()) {
                user.password = cryptPass(user.password);
            }

            user.save(function (err, data) {
                if (err) {
                    params.errors = err;
                    that.transfer("edit");
                } else {
                    that.redirect({
                        controller: that.name
                    });
                }
            });
        });
    };

    this.destroy = function (req, resp, params) {
        var that = this;

        geddy.model.User.remove(params.id, function (err) {
            if (err) {
                params.errors = err;
                that.transfer("edit");
            } else {
                that.redirect({
                    controller: that.name
                });
            }
        });
    };
};

exports.Users = Users;
