var Settings = function () {
    this.respondsWith = ["html", "json"];

    this.before(this.requireAuth);

    this.index = function (req, resp, params) {
        if (!params.page || params.page === "index") {
            params.page = "subscription";
        }

        this.respond(params);
    };

    this.update = function (req, resp, params) {
        this.redirect(req.headers.referer || "/");
    };
};

exports.Settings = Settings;
